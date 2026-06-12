'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, CheckCircle2, ClipboardList, Clock, Eye, LogOut, Phone, ShoppingBag, User, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/useCartStore';
import styles from './page.module.css';

interface UserProfile {
  id: string;
  email: string;
  nome: string;
  telefone: string | null;
  role: string;
}

interface Orcamento {
  id: string;
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

export default function Perfil() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useRouter();
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    async function loadData() {
      try {
        const profileRes = await fetch('/api/auth/me');
        if (!profileRes.ok) {
          router.push('/login');
          return;
        }

        const profileData = await profileRes.json();
        setProfile(profileData.user);

        const orcamentosRes = await fetch('/api/orcamentos');
        if (orcamentosRes.ok) {
          const orcamentosData = await orcamentosRes.json();
          setOrcamentos(orcamentosData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        toast.success('Desconectado com sucesso.');
        router.refresh();
        router.push('/');
      }
    } catch (error) {
      toast.error('Erro ao desconectar.');
    }
  };

  const handleReorder = (orcamento: Orcamento) => {
    try {
      const itens = JSON.parse(orcamento.itensJson);
      if (Array.isArray(itens)) {
        itens.forEach((item: any) => {
          // Re-adiciona cada produto do orçamento anterior
          addItem({
            id: item.produto.id,
            nome: item.produto.nome,
            referencia: item.produto.referencia,
            codigoInterno: item.produto.codigoInterno,
            preco: item.produto.preco,
            estoque: item.produto.estoque || 0,
            categoria: item.produto.categoria,
            marca: item.produto.marca,
            imagemUrl: item.produto.imagemUrl,
          }, item.quantidade);
        });
        toast.success('Itens adicionados ao carrinho de orçamento!');
      }
    } catch {
      toast.error('Não foi possível ler os itens do orçamento.');
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Carregando dados da conta...</div>;
  }

  if (!profile) return null;

  return (
    <div className={`container ${styles.perfilPage}`}>
      <div className={styles.layout}>
        {/* Sidebar Info */}
        <aside className={styles.sidebar}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>
              <User size={40} />
            </div>
            <h3>{profile.nome}</h3>
            <span className={styles.roleBadge}>{profile.role === 'ADMIN' ? 'Administrador' : 'Cliente'}</span>
            
            <div className={styles.detailsList}>
              <div className={styles.detailItem}>
                <User size={16} />
                <span>{profile.email}</span>
              </div>
              {profile.telefone && (
                <div className={styles.detailItem}>
                  <Phone size={16} />
                  <span>{profile.telefone}</span>
                </div>
              )}
            </div>

            <button onClick={handleLogout} className={styles.logoutBtn}>
              <LogOut size={18} />
              Sair da Conta
            </button>
          </div>
        </aside>

        {/* Histórico de Orçamentos */}
        <main className={styles.mainContent}>
          <div className={styles.titleArea}>
            <ClipboardList size={28} color="var(--primary-blue)" />
            <h2>Histórico de Orçamentos</h2>
          </div>

          {orcamentos.length === 0 ? (
            <div className={styles.emptyState}>
              <ShoppingBag size={48} />
              <p>Você ainda não realizou nenhum orçamento.</p>
              <Link href="/produtos" className="btn-primary" style={{ marginTop: '1rem' }}>
                Conhecer Produtos
              </Link>
            </div>
          ) : (
            <div className={styles.ordersList}>
              {orcamentos.map((orcamento) => {
                const itens = JSON.parse(orcamento.itensJson) as any[];
                const date = new Date(orcamento.dataCriacao).toLocaleDateString('pt-BR');
                const isExpanded = expandedId === orcamento.id;

                const statusStyles = {
                  PENDENTE: { icon: Clock, color: '#92400E', bg: '#FEF3C7', label: 'Pendente' },
                  ATENDIDO: { icon: CheckCircle2, color: '#03543F', bg: '#DEF7EC', label: 'Atendido' },
                  CANCELADO: { icon: XCircle, color: '#9B1C1C', bg: '#FDE8E8', label: 'Cancelado' },
                }[orcamento.status];

                const StatusIcon = statusStyles.icon;

                return (
                  <article key={orcamento.id} className={styles.orderCard}>
                    {/* Header do Orçamento */}
                    <div className={styles.orderHeader} onClick={() => setExpandedId(isExpanded ? null : orcamento.id)}>
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
                          {statusStyles.label}
                        </span>
                        
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleReorder(orcamento);
                            }}
                            className={styles.reorderBtn}
                            title="Adicionar estes itens de volta ao carrinho"
                          >
                            Pedir Novamente
                          </button>
                          <button type="button" className={styles.expandIcon}>
                            <Eye size={18} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Itens do Orçamento - Expansível */}
                    {isExpanded && (
                      <div className={styles.orderDetails}>
                        <div className={styles.detailsGrid}>
                          <div>
                            <strong>Dados de Envio:</strong>
                            <p>{orcamento.entregaMetodo === 'entrega' ? `Entrega em ${orcamento.cidade} - ${orcamento.bairro} (${orcamento.endereco})` : 'Retirada na loja'}</p>
                          </div>
                          <div>
                            <strong>Pagamento:</strong>
                            <p>{orcamento.formaPagamento}</p>
                          </div>
                          {orcamento.observacoes && (
                            <div style={{ gridColumn: '1 / -1' }}>
                              <strong>Observações:</strong>
                              <p>{orcamento.observacoes}</p>
                            </div>
                          )}
                        </div>

                        <div className={styles.itemsTable}>
                          <h4>Itens do Pedido</h4>
                          <table>
                            <thead>
                              <tr>
                                <th>Peça</th>
                                <th>Marca</th>
                                <th style={{ textAlign: 'center' }}>Qtd</th>
                                <th style={{ textAlign: 'right' }}>Valor Site</th>
                              </tr>
                            </thead>
                            <tbody>
                              {itens.map((item, idx) => (
                                <tr key={idx}>
                                  <td>
                                    <div className={styles.itemName}>{item.produto.nome}</div>
                                    <div className={styles.itemCode}>Cod: {item.produto.codigoInterno}</div>
                                  </td>
                                  <td>{item.produto.marca || 'Não informada'}</td>
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
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
