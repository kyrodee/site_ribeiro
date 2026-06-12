'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  EyeOff,
  FileSpreadsheet,
  Lock,
  MessageSquare,
  Package,
  Phone,
  RefreshCw,
  Search,
  Star,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './page.module.css';

interface Product {
  id: string;
  nome: string;
  referencia: string;
  codigoInterno: string;
  preco: number | null;
  estoque: number;
  categoria: string | null;
  marca: string | null;
  imagemUrl?: string | null;
}

interface OrcamentoItem {
  produto: Product;
  quantidade: number;
}

interface Orcamento {
  id: string;
  usuarioId: string | null;
  clienteNome: string;
  clienteTelefone: string | null;
  entregaMetodo: string;
  cidade: string | null;
  bairro: string | null;
  endereco: string | null;
  formaPagamento: string;
  observacoes: string | null;
  itensJson: string;
  status: 'PENDENTE' | 'ATENDIDO' | 'CANCELADO';
  dataCriacao: string;
}

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'orcamentos' | 'vitrine'>('orcamentos');
  
  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  
  // Loading & Filter States
  const [loadingData, setLoadingData] = useState(true);
  const [productSearch, setProductSearch] = useState('');
  const [productFilter, setProductFilter] = useState('todos'); // todos, visiveis, ocultos, sem_imagem
  
  const [orcamentoSearch, setOrcamentoSearch] = useState('');
  const [orcamentoFilter, setOrcamentoFilter] = useState('TODOS'); // TODOS, PENDENTE, ATENDIDO, CANCELADO

  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          setIsAdmin(false);
          router.push('/login');
          return;
        }

        const data = await response.json();
        if (data.authenticated && data.user && data.user.role === 'ADMIN') {
          setIsAdmin(true);
          // Load dashboard data
          loadDashboardData();
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Erro ao verificar permissão admin:', err);
        setIsAdmin(false);
      }
    }

    checkAuth();
  }, [router]);

  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      // 1. Fetch budgets
      const orcamentosRes = await fetch('/api/orcamentos');
      if (orcamentosRes.ok) {
        const orcamentosData = await orcamentosRes.json();
        setOrcamentos(orcamentosData);
      }

      // 2. Fetch products
      const produtosRes = await fetch('/api/produtos?limit=150');
      if (produtosRes.ok) {
        const produtosData = await produtosRes.json();
        setProducts(produtosData);
      }
    } catch (err) {
      console.error('Erro ao carregar dados do painel:', err);
      toast.error('Erro ao carregar os dados.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orcamentos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar orçamento.');
      }

      toast.success('Status atualizado!');
      setOrcamentos((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus as any } : o))
      );
    } catch (err) {
      toast.error('Erro ao salvar alteração.');
    }
  };

  if (isAdmin === null) {
    return <div className={styles.loadingBox}>Verificando credenciais de acesso administrativo...</div>;
  }

  if (isAdmin === false) {
    return (
      <div className={`container ${styles.deniedBox}`}>
        <Lock size={48} color="#DC2626" />
        <h2>Acesso Negado</h2>
        <p>Você não tem privilégios de administrador para ver esta página.</p>
        <Link href="/login" className="btn-primary">
          Fazer Login como Admin
        </Link>
      </div>
    );
  }

  // Count metrics for budgets
  const stats = {
    total: orcamentos.length,
    pendente: orcamentos.filter((o) => o.status === 'PENDENTE').length,
    atendido: orcamentos.filter((o) => o.status === 'ATENDIDO').length,
    cancelado: orcamentos.filter((o) => o.status === 'CANCELADO').length,
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nome.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.codigoInterno.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.referencia && p.referencia.toLowerCase().includes(productSearch.toLowerCase()));

    if (!matchesSearch) return false;

    if (productFilter === 'visiveis') return true; // Todo mock/inventário é visível por padrão
    if (productFilter === 'ocultos') return false; 
    if (productFilter === 'sem_imagem') return !p.imagemUrl;

    return true;
  });

  // Filter budgets
  const filteredOrcamentos = orcamentos.filter((o) => {
    const matchesSearch =
      o.clienteNome.toLowerCase().includes(orcamentoSearch.toLowerCase()) ||
      o.id.toLowerCase().includes(orcamentoSearch.toLowerCase()) ||
      (o.clienteTelefone && o.clienteTelefone.includes(orcamentoSearch));

    const matchesStatus = orcamentoFilter === 'TODOS' || o.status === orcamentoFilter;

    return matchesSearch && matchesStatus;
  });

  const getWhatsappContactUrl = (name: string, phone: string, refId: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    // Se o telefone não tiver o código do país DDI (55), adiciona
    const formattedPhone = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone;
    const text = encodeURIComponent(
      `Olá ${name}! Sou da equipe Ribeiro AutoPeças referente ao seu orçamento enviado pelo site (Ref: ${refId.slice(0, 8).toUpperCase()}). Como posso te ajudar a finalizar seu pedido?`
    );
    return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${text}`;
  };

  return (
    <div className={`container ${styles.adminContainer}`}>
      <div className={styles.header}>
        <div>
          <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>Painel Administrativo</h1>
          <p className={styles.subtitle}>Consulte os orçamentos recebidos dos clientes e a vitrine de produtos.</p>
        </div>
        <button onClick={loadDashboardData} className="btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <RefreshCw size={18} className={loadingData ? 'animate-spin' : ''} />
          Atualizar Dados
        </button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          type="button"
          onClick={() => setActiveTab('orcamentos')}
          className={`${styles.tabBtn} ${activeTab === 'orcamentos' ? styles.activeTab : ''}`}
        >
          <FileSpreadsheet size={18} />
          Orçamentos Recebidos ({stats.total})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('vitrine')}
          className={`${styles.tabBtn} ${activeTab === 'vitrine' ? styles.activeTab : ''}`}
        >
          <Package size={18} />
          Vitrine de Peças ({products.length})
        </button>
      </div>

      {loadingData ? (
        <div className={styles.loadingBox}>Carregando dados do servidor...</div>
      ) : activeTab === 'orcamentos' ? (
        /* ABA DE ORÇAMENTOS */
        <div>
          {/* Métricas */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span>Orçamentos Totais</span>
              <strong>{stats.total}</strong>
            </div>
            <div className={styles.statCard} style={{ borderLeft: '4px solid #FEF3C7' }}>
              <span>Pendentes</span>
              <strong style={{ color: '#D97706' }}>{stats.pendente}</strong>
            </div>
            <div className={styles.statCard} style={{ borderLeft: '4px solid #DEF7EC' }}>
              <span>Atendidos</span>
              <strong style={{ color: '#059669' }}>{stats.atendido}</strong>
            </div>
            <div className={styles.statCard} style={{ borderLeft: '4px solid #FDE8E8' }}>
              <span>Cancelados</span>
              <strong style={{ color: '#DC2626' }}>{stats.cancelado}</strong>
            </div>
          </div>

          {/* Filtros */}
          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar por cliente, telefone ou ID do orçamento..."
                value={orcamentoSearch}
                onChange={(e) => setOrcamentoSearch(e.target.value)}
              />
            </div>
            <select
              className={styles.filterSelect}
              value={orcamentoFilter}
              onChange={(e) => setOrcamentoFilter(e.target.value)}
            >
              <option value="TODOS">Todos os Status</option>
              <option value="PENDENTE">Pendentes</option>
              <option value="ATENDIDO">Atendidos</option>
              <option value="CANCELADO">Cancelados</option>
            </select>
          </div>

          {filteredOrcamentos.length === 0 ? (
            <div className={styles.loadingBox}>Nenhum orçamento encontrado.</div>
          ) : (
            <div className={styles.ordersList}>
              {filteredOrcamentos.map((orcamento) => {
                const itens = JSON.parse(orcamento.itensJson) as OrcamentoItem[];
                const date = new Date(orcamento.dataCriacao).toLocaleString('pt-BR');
                
                const statusStyles = {
                  PENDENTE: { color: '#92400E', bg: '#FEF3C7', icon: Clock },
                  ATENDIDO: { color: '#03543F', bg: '#DEF7EC', icon: CheckCircle2 },
                  CANCELADO: { color: '#9B1C1C', bg: '#FDE8E8', icon: XCircle },
                }[orcamento.status];

                const StatusIcon = statusStyles.icon;

                return (
                  <article key={orcamento.id} className={styles.orderCard}>
                    {/* Header */}
                    <div className={styles.orderHeader}>
                      <div className={styles.orderMeta}>
                        <span className={styles.orderDate}>
                          <Calendar size={16} /> {date}
                        </span>
                        <span className={styles.orderId}>Ref: {orcamento.id.slice(0, 8).toUpperCase()}</span>
                      </div>

                      <div className={styles.orderStatusArea}>
                        <span
                          className={styles.statusBadge}
                          style={{ backgroundColor: statusStyles.bg, color: statusStyles.color }}
                        >
                          <StatusIcon size={14} />
                          {orcamento.status}
                        </span>

                        <select
                          className={styles.statusSelect}
                          value={orcamento.status}
                          onChange={(e) => handleUpdateStatus(orcamento.id, e.target.value)}
                        >
                          <option value="PENDENTE">PENDENTE</option>
                          <option value="ATENDIDO">ATENDIDO</option>
                          <option value="CANCELADO">CANCELADO</option>
                        </select>
                      </div>
                    </div>

                    {/* Detalhes */}
                    <div className={styles.orderDetails}>
                      <div className={styles.detailsGrid}>
                        <div>
                          <strong>Cliente:</strong>
                          <p>{orcamento.clienteNome}</p>
                          {orcamento.clienteTelefone && (
                            <a
                              href={getWhatsappContactUrl(orcamento.clienteNome, orcamento.clienteTelefone, orcamento.id)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.clientLink}
                            >
                              <Phone size={14} />
                              {orcamento.clienteTelefone} (WhatsApp)
                            </a>
                          )}
                        </div>
                        <div>
                          <strong>Fulfillment / Entrega:</strong>
                          <p>
                            {orcamento.entregaMetodo === 'entrega'
                              ? `Entrega: ${orcamento.cidade || ''} - ${orcamento.bairro || ''} (${orcamento.endereco || ''})`
                              : 'Retirada em Loja'}
                          </p>
                        </div>
                        <div>
                          <strong>Pagamento:</strong>
                          <p>{orcamento.formaPagamento}</p>
                        </div>
                        {orcamento.observacoes && (
                          <div style={{ gridColumn: '1 / -1' }}>
                            <strong>Observações do Cliente:</strong>
                            <p>{orcamento.observacoes}</p>
                          </div>
                        )}
                      </div>

                      {/* Tabela de Itens */}
                      <div className={styles.itemsTable}>
                        <h4>Itens Solicitados</h4>
                        <table>
                          <thead>
                            <tr>
                              <th>Peça</th>
                              <th>Marca / Cat</th>
                              <th style={{ textAlign: 'center' }}>Qtd</th>
                              <th style={{ textAlign: 'right' }}>Preço no Site</th>
                            </tr>
                          </thead>
                          <tbody>
                            {itens.map((item, idx) => (
                              <tr key={idx}>
                                <td>
                                  <div className={styles.itemName}>{item.produto.nome}</div>
                                  <div className={styles.itemCode}>Cod: {item.produto.codigoInterno} | Ref: {item.produto.referencia}</div>
                                </td>
                                <td>{item.produto.marca || 'Não inf.'} / {item.produto.categoria || 'Diversos'}</td>
                                <td style={{ textAlign: 'center' }}>{item.quantidade}</td>
                                <td style={{ textAlign: 'right' }}>
                                  {item.produto.preco
                                    ? `R$ ${(item.produto.preco * item.quantidade).toFixed(2).replace('.', ',')}`
                                    : 'Sob consulta'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* ABA DA VITRINE DE PRODUTOS */
        <div>
          {/* Filtros de Produtos */}
          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar produto por nome, código ou referência..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
            </div>
            <select
              className={styles.filterSelect}
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
            >
              <option value="todos">Todos os Produtos</option>
              <option value="visiveis">Apenas Visíveis</option>
              <option value="sem_imagem">Sem Imagem</option>
            </select>
          </div>

          {/* Tabela de Produtos */}
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cód / Ref</th>
                  <th>Produto original</th>
                  <th>Status na vitrine</th>
                  <th>Imagem</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((produto) => (
                  <tr key={produto.id}>
                    <td>
                      <span className={styles.code}>{produto.codigoInterno}</span>
                      <span className={styles.ref}>{produto.referencia}</span>
                    </td>
                    <td>
                      <div className={styles.productName}>{produto.nome}</div>
                      <div className={styles.productCat}>{produto.categoria || 'Sem cat.'} - {produto.marca || 'Sem marca.'}</div>
                    </td>
                    <td>
                      <div className={styles.statusGroup}>
                        <span className={`${styles.statusBadge} ${styles.statusVisible}`}>Visível</span>
                        {produto.estoque > 10 && (
                          <span className={`${styles.statusBadge} ${styles.statusFeatured}`}>
                            <Star size={12} /> Destaque
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {produto.imagemUrl ? (
                        <span className={styles.statusBadge} style={{ backgroundColor: '#DEF7EC', color: '#03543F' }}>
                          Sim
                        </span>
                      ) : (
                        <span className={styles.noImageBadge}>Pendente</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionBtn}
                          title="Editar enriquecimento"
                          onClick={() => router.push(`/produtos/${produto.id}`)}
                        >
                          <Edit2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
