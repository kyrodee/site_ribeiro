import argparse
import json
import re
import unicodedata
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path

import fitz


MONEY_RE = re.compile(r"^\d{1,3}(?:\.\d{3})*,\d{2}$|^\d+,\d{2}$")
QTY_RE = re.compile(r"^\d+(?:,\d+)?$")
REFERENCE_RE = re.compile(r"\b[A-Za-z]{0,5}\d[A-Za-z0-9./-]{2,}\b")


BRANDS = [
    ("mercedes", "Mercedes-Benz"),
    ("mbb", "Mercedes-Benz"),
    ("scania", "Scania"),
    ("volvo", "Volvo"),
    ("volkswagen", "Volkswagen"),
    ("vw", "Volkswagen"),
    ("ford", "Ford"),
    ("iveco", "Iveco"),
    ("daf", "DAF"),
    ("man", "MAN"),
    ("agrale", "Agrale"),
    ("wabco", "Wabco"),
    ("bosch", "Bosch"),
    ("knorr", "Knorr"),
    ("knoor", "Knorr"),
]


CATEGORIES = [
    ("Freios", ["freio", "pastilha", "tambor", "sapata", "patim", "pinca", "cuica"]),
    ("Filtros", ["filtro", "separador agua"]),
    ("Arrefecimento", ["radiador", "aditivo", "reserv agua", "agua", "mangueira radiador", "valv termostatica"]),
    ("Eletrica/Sensores", ["sensor", "alternador", "arranque", "chicote", "rele", "bateria", "lamp", "solenoide"]),
    ("Motor", ["motor", "biela", "pistao", "cabecote", "virabrequim", "bronzina", "camisa", "mancal", "carter"]),
    ("Embreagem", ["embreagem", "plato", "disco emb", "garfo emb", "cil emb"]),
    ("Suspensao", ["susp", "amort", "mola", "bucha", "barra estab", "tirante", "bolsa ar"]),
    ("Cabine", ["cabine", "porta", "retrovisor", "parabrisa", "vidro", "macaneta", "grade", "paralama", "capo"]),
    ("Escapamento", ["escap", "silencioso", "catalisador"]),
    ("Transmissao", ["cardan", "cambio", "diferencial", "tracao", "sincronizado", "cubo"]),
    ("Bombas", ["bomba"]),
    ("Iluminacao", ["farol", "lanterna", "pisca", "luz"]),
]


def normalize_text(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    return re.sub(r"\s+", " ", re.sub(r"[^a-zA-Z0-9]+", " ", ascii_text)).strip().lower()


def parse_money(value: str) -> float:
    return float(value.replace(".", "").replace(",", "."))


def parse_qty(value: str) -> float:
    return float(value.replace(",", "."))


def clean_ncm(value: str) -> str | None:
    cleaned = value.strip().strip("'`.,;:[]() ")
    return cleaned if re.fullmatch(r"\d{8}", cleaned) else None


def clean_unit(value: str) -> str | None:
    cleaned = re.sub(r"[^A-Za-z]", "", value).upper()
    return cleaned if 1 <= len(cleaned) <= 6 else None


def is_close(left: float, right: float) -> bool:
    return abs(left - right) <= 0.05


def page_body_lines(page: fitz.Page) -> list[str]:
    lines = [raw.strip() for raw in page.get_text("text").splitlines() if raw.strip()]
    start = 0

    for index, line in enumerate(lines):
        if line == "Valor total":
            start = index + 1
            break

    return lines[start:]


def parse_pdf(pdf_path: Path) -> list[dict]:
    rows = []

    with fitz.open(pdf_path) as document:
        for page_number, page in enumerate(document, start=1):
            lines = page_body_lines(page)
            index = 0
            current_ncm = None

            while index < len(lines):
                line = lines[index]

                if line.lower() == "total":
                    break

                ncm = clean_ncm(line)
                if ncm:
                    current_ncm = ncm
                    index += 1
                    continue

                description = line
                index += 1
                unit = "UN"

                if index < len(lines):
                    possible_unit = clean_unit(lines[index])
                    if (
                        possible_unit
                        and not clean_ncm(lines[index])
                        and not MONEY_RE.fullmatch(lines[index])
                        and not QTY_RE.fullmatch(lines[index])
                    ):
                        unit = possible_unit
                        index += 1
                    elif re.fullmatch(r"\W+", lines[index]):
                        index += 1

                parsed = None

                if (
                    index + 2 < len(lines)
                    and QTY_RE.fullmatch(lines[index])
                    and MONEY_RE.fullmatch(lines[index + 1])
                    and MONEY_RE.fullmatch(lines[index + 2])
                ):
                    parsed = (
                        parse_qty(lines[index]),
                        parse_money(lines[index + 1]),
                        parse_money(lines[index + 2]),
                        3,
                    )
                elif (
                    index + 3 < len(lines)
                    and QTY_RE.fullmatch(lines[index])
                    and QTY_RE.fullmatch(lines[index + 1])
                    and MONEY_RE.fullmatch(lines[index + 2])
                    and MONEY_RE.fullmatch(lines[index + 3])
                ):
                    first_qty = parse_qty(lines[index])
                    second_qty = parse_qty(lines[index + 1])
                    unit_value = parse_money(lines[index + 2])
                    total_value = parse_money(lines[index + 3])
                    qty = second_qty if is_close(second_qty * unit_value, total_value) or not is_close(first_qty * unit_value, total_value) else first_qty
                    parsed = (qty, unit_value, total_value, 4)

                if parsed is None:
                    raise ValueError(f"Nao foi possivel ler a pagina {page_number}, linha: {description!r}")

                qty, unit_value, total_value, consumed = parsed
                rows.append(
                    {
                        "pagina": page_number,
                        "ncm": current_ncm,
                        "descricao": re.sub(r"\s+", " ", description).strip(),
                        "unidade": unit,
                        "quantidade": qty,
                        "valorUnitarioInventario": unit_value,
                        "valorTotalInventario": total_value,
                    }
                )

                current_ncm = None
                index += consumed

    return rows


def infer_brand(description: str) -> str | None:
    normalized = normalize_text(description)
    tokens = set(normalized.split())

    for keyword, brand in BRANDS:
        if keyword in tokens:
            return brand

    return None


def infer_category(description: str) -> str:
    normalized = normalize_text(description)

    for category, keywords in CATEGORIES:
        if any(keyword in normalized for keyword in keywords):
            return category

    return "Diversos"


def infer_reference(description: str, fallback: str) -> str:
    matches = [match.group(0).strip(".,;:/-") for match in REFERENCE_RE.finditer(description)]
    matches = [match.upper() for match in matches if len(re.sub(r"\D", "", match)) >= 3]
    return matches[-1] if matches else fallback


def format_name(description: str) -> str:
    description = re.sub(r"\s+", " ", description).strip()
    return description[:1].upper() + description[1:]


def aggregate_products(rows: list[dict], include_inventory_values: bool = False) -> list[dict]:
    grouped = defaultdict(list)

    for row in rows:
        grouped[normalize_text(row["descricao"])].append(row)

    products = []

    for index, rows_for_product in enumerate(
        sorted(grouped.values(), key=lambda group: normalize_text(group[0]["descricao"])),
        start=1,
    ):
        product_id = f"INV-{index:05d}"
        description = rows_for_product[0]["descricao"]
        total_qty = sum(row["quantidade"] for row in rows_for_product)
        total_value = sum(row["valorTotalInventario"] for row in rows_for_product)
        unit_counter = Counter(row["unidade"] for row in rows_for_product)
        ncm_counter = Counter(row["ncm"] for row in rows_for_product if row["ncm"])
        pages = sorted({row["pagina"] for row in rows_for_product})
        inventory_unit_value = round(total_value / total_qty, 2) if total_qty else None

        product = {
            "id": product_id,
            "nome": format_name(description),
            "referencia": infer_reference(description, product_id),
            "codigoInterno": product_id,
            "preco": None,
            "estoque": int(total_qty) if total_qty.is_integer() else round(total_qty, 3),
            "categoria": infer_category(description),
            "marca": infer_brand(description),
            "imagemUrl": None,
            "ncm": ncm_counter.most_common(1)[0][0] if ncm_counter else None,
            "unidade": unit_counter.most_common(1)[0][0] if unit_counter else "UN",
            "linhasAgrupadas": len(rows_for_product),
            "paginasOrigem": pages,
        }

        if include_inventory_values:
            product["valorUnitarioInventario"] = inventory_unit_value
            product["valorTotalInventario"] = round(total_value, 2)

        products.append(product)

    return products


def main() -> None:
    parser = argparse.ArgumentParser(description="Importa o PDF de inventario para JSON usado pelo site.")
    parser.add_argument("pdf", nargs="?", default="inventario.pdf", help="Caminho do PDF de inventario.")
    parser.add_argument(
        "output",
        nargs="?",
        default="src/data/produtos-inventario.json",
        help="Arquivo JSON de saida.",
    )
    parser.add_argument(
        "--include-inventory-values",
        action="store_true",
        help="Inclui valores contabeis do inventario no JSON. Nao recomendado para catalogo publico.",
    )
    args = parser.parse_args()

    pdf_path = Path(args.pdf)
    output_path = Path(args.output)
    rows = parse_pdf(pdf_path)
    products = aggregate_products(rows, include_inventory_values=args.include_inventory_values)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    payload = {
        "fonte": str(pdf_path),
        "geradoEm": datetime.now().isoformat(timespec="seconds"),
        "totalLinhasPdf": len(rows),
        "totalProdutos": len(products),
        "observacao": "preco fica null por seguranca: Valor unitario do inventario pode ser custo, nao preco de venda.",
        "produtos": products,
    }

    if args.include_inventory_values:
        payload["valorTotalInventario"] = round(sum(row["valorTotalInventario"] for row in rows), 2)

    output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(rows)} linhas importadas, {len(products)} produtos gerados em {output_path}.")


if __name__ == "__main__":
    main()
