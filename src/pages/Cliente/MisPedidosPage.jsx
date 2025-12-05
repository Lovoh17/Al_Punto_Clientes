import React, { useState, useEffect } from 'react';
import { pedidoService } from '../../services/api';
import { useAuth } from '../../AuthContext';


const colors = {
  primary: '#2c5aa0',
  primaryLight: '#3a6bc5',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  }
};

const MisPedidosPage = () => {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      cargarPedidos();
    }
  }, [user]);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user || !user.id) {
        setError('No se pudo identificar al usuario');
        setLoading(false);
        return;
      }

      console.log('Cargando pedidos para usuario ID:', user.id);
      
      // Usar el endpoint específico para obtener pedidos del cliente
      const response = await pedidoService.getByCliente(user.id);
      
      console.log('Respuesta de API:', response);
      
      
      const pedidosData = response.data?.data || response.data || [];
      console.log('Datos de pedidos:', pedidosData);
      
      setPedidos(Array.isArray(pedidosData) ? pedidosData : []);
      
    } catch (err) {
      console.error('Error cargando pedidos:', err);
      setError('No se pudieron cargar los pedidos. ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  // También necesitarás actualizar tu servicio de API para agregar este método
  // Si no lo tienes, agrégalo así:
  /*
  // En services/api.js
  export const pedidoService = {
    getAll: () => api.get('/Pedidos'),
    getById: (id) => api.get(`/Pedidos/${id}`),
    getByCliente: (usuarioId) => api.get(`/Pedidos/cliente/${usuarioId}`), // <-- Agregar esto
    create: (pedido) => api.post('/Pedidos', pedido),
    update: (id, pedido) => api.put(`/Pedidos/${id}`, pedido),
    cancelar: (id) => api.patch(`/Pedidos/${id}/cancelar`),
    delete: (id) => api.delete(`/Pedidos/${id}`),
  };
  */

  const handleCancelarPedido = async (pedidoId) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
      return;
    }

    try {
      await pedidoService.cancelar(pedidoId);
      alert('Pedido cancelado exitosamente');
      cargarPedidos();
    } catch (err) {
      alert('No se pudo cancelar el pedido: ' + (err.message || ''));
    }
  };

  const pedidosFiltrados = pedidos.filter(pedido => {
    if (filtroEstado === 'todos') return true;
    return pedido.estado === filtroEstado;
  });

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: colors.warning,
      en_preparacion: colors.info,
      listo: colors.success,
      entregado: colors.gray[600],
      cancelado: colors.danger
    };
    return colores[estado] || colors.gray[500];
  };

  const getEstadoTexto = (estado) => {
    const textos = {
      pendiente: 'Pendiente',
      en_preparacion: 'En Preparación',
      listo: 'Listo',
      entregado: 'Entregado',
      cancelado: 'Cancelado'
    };
    return textos[estado] || estado;
  };

  const getEstadoIcono = (estado) => {
    const iconos = {
      pendiente: '⏳',
      en_preparacion: '👨‍🍳',
      listo: '✅',
      entregado: '📦',
      cancelado: '❌'
    };
    return iconos[estado] || '📋';
  };

  // Si no hay usuario, mostrar mensaje
  if (!user) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '24px',
        background: colors.gray[50]
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔒</div>
        <h3 style={{ 
          fontSize: '24px', 
          fontWeight: '700', 
          color: colors.gray[900],
          marginBottom: '8px'
        }}>
          Acceso requerido
        </h3>
        <p style={{ 
          fontSize: '16px', 
          color: colors.gray[600],
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          Debes iniciar sesión para ver tus pedidos
        </p>
        <button
          onClick={() => window.location.href = '/login'}
          style={{
            background: colors.primary,
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Iniciar sesión
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Cargando tus pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>⚠️</div>
        <h3 style={styles.errorTitle}>Error al cargar pedidos</h3>
        <p style={styles.errorText}>{error}</p>
        <button onClick={cargarPedidos} style={styles.retryButton}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Mis Pedidos</h1>
          <p style={styles.subtitle}>
            Bienvenido, {user.nombre || 'Cliente'} - Historial y seguimiento de tus pedidos
          </p>
        </div>
        <div style={styles.statsCard}>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{pedidos.length}</div>
            <div style={styles.statLabel}>Total</div>
          </div>
          <div style={styles.dividerVertical} />
          <div style={styles.statItem}>
            <div style={styles.statValue}>
              {pedidos.filter(p => p.estado === 'entregado').length}
            </div>
            <div style={styles.statLabel}>Completados</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div style={styles.filterBar}>
        <div style={styles.filterButtons}>
          {[
            { key: 'todos', label: 'Todos', count: pedidos.length },
            { key: 'pendiente', label: 'Pendientes', count: pedidos.filter(p => p.estado === 'pendiente').length },
            { key: 'en_preparacion', label: 'En Preparación', count: pedidos.filter(p => p.estado === 'en_preparacion').length },
            { key: 'listo', label: 'Listos', count: pedidos.filter(p => p.estado === 'listo').length },
            { key: 'entregado', label: 'Entregados', count: pedidos.filter(p => p.estado === 'entregado').length }
          ].map(filtro => (
            <button
              key={filtro.key}
              onClick={() => setFiltroEstado(filtro.key)}
              style={{
                ...styles.filterButton,
                ...(filtroEstado === filtro.key ? styles.filterButtonActive : {})
              }}
            >
              {filtro.label}
              <span style={styles.filterBadge}>{filtro.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Lista de pedidos */}
      {pedidosFiltrados.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📦</div>
          <h3 style={styles.emptyTitle}>No hay pedidos</h3>
          <p style={styles.emptyText}>
            {filtroEstado === 'todos' 
              ? 'Aún no has realizado ningún pedido'
              : `No tienes pedidos ${getEstadoTexto(filtroEstado).toLowerCase()}`
            }
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={styles.btnNuevoPedido}
          >
            Hacer mi primer pedido
          </button>
        </div>
      ) : (
        <div style={styles.pedidosGrid}>
          {pedidosFiltrados.map(pedido => (
            <div key={pedido.id || pedido._id} style={styles.pedidoCard}>
              {/* Header del pedido */}
              <div style={styles.pedidoHeader}>
                <div style={styles.pedidoHeaderLeft}>
                  <div style={styles.pedidoNumero}>
                    #{pedido.numero_pedido}
                  </div>
                  <div style={styles.pedidoFecha}>
                    {new Date(pedido.fecha_creacion || pedido.fecha_pedido || pedido.createdAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div style={{
                  ...styles.estadoBadge,
                  backgroundColor: getEstadoColor(pedido.estado) + '15',
                  color: getEstadoColor(pedido.estado),
                  borderColor: getEstadoColor(pedido.estado)
                }}>
                  <span style={styles.estadoIcono}>
                    {getEstadoIcono(pedido.estado)}
                  </span>
                  {getEstadoTexto(pedido.estado)}
                </div>
              </div>

              {/* Información del pedido */}
              <div style={styles.pedidoBody}>
                {pedido.numero_mesa && pedido.numero_mesa !== 'Delivery' && (
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Mesa:</span>
                    <span style={styles.infoValue}>{pedido.numero_mesa}</span>
                  </div>
                )}
                {pedido.ubicacion && (
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Dirección:</span>
                    <span style={styles.infoValue}>{pedido.ubicacion}</span>
                  </div>
                )}
                {pedido.notas && (
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Notas:</span>
                    <span style={styles.infoValue}>{pedido.notas}</span>
                  </div>
                )}
              </div>

              {/* Footer del pedido */}
              <div style={styles.pedidoFooter}>
                <div style={styles.totalContainer}>
                  <span style={styles.totalLabel}>Total:</span>
                  <span style={styles.totalValue}>
                    ${parseFloat(pedido.total || 0).toFixed(2)}
                  </span>
                </div>
                <div style={styles.pedidoActions}>
                  <button
                    onClick={() => setPedidoSeleccionado(pedido)}
                    style={styles.btnVer}
                  >
                    Ver Detalle
                  </button>
                  {(pedido.estado === 'pendiente' || pedido.estado === 'en_preparacion') && (
                    <button
                      onClick={() => handleCancelarPedido(pedido.id || pedido._id)}
                      style={styles.btnCancelar}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalle */}
      {pedidoSeleccionado && (
        <div style={styles.modalOverlay} onClick={() => setPedidoSeleccionado(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                Detalle del Pedido #{pedidoSeleccionado.numero_pedido}
              </h3>
              <button
                onClick={() => setPedidoSeleccionado(null)}
                style={styles.modalClose}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.modalSection}>
                <h4 style={styles.modalSectionTitle}>Estado</h4>
                <div style={{
                  ...styles.estadoBadge,
                  backgroundColor: getEstadoColor(pedidoSeleccionado.estado) + '15',
                  color: getEstadoColor(pedidoSeleccionado.estado),
                  borderColor: getEstadoColor(pedidoSeleccionado.estado),
                  display: 'inline-flex'
                }}>
                  <span style={styles.estadoIcono}>
                    {getEstadoIcono(pedidoSeleccionado.estado)}
                  </span>
                  {getEstadoTexto(pedidoSeleccionado.estado)}
                </div>
              </div>

              <div style={styles.modalSection}>
                <h4 style={styles.modalSectionTitle}>Información</h4>
                <div style={styles.modalInfo}>
                  <div style={styles.modalInfoRow}>
                    <span style={styles.modalInfoLabel}>Fecha:</span>
                    <span style={styles.modalInfoValue}>
                      {new Date(pedidoSeleccionado.fecha_creacion || pedidoSeleccionado.fecha_pedido || pedidoSeleccionado.createdAt).toLocaleString('es-ES')}
                    </span>
                  </div>
                  {pedidoSeleccionado.numero_mesa && pedidoSeleccionado.numero_mesa !== 'Delivery' && (
                    <div style={styles.modalInfoRow}>
                      <span style={styles.modalInfoLabel}>Mesa:</span>
                      <span style={styles.modalInfoValue}>{pedidoSeleccionado.numero_mesa}</span>
                    </div>
                  )}
                  {pedidoSeleccionado.ubicacion && (
                    <div style={styles.modalInfoRow}>
                      <span style={styles.modalInfoLabel}>Dirección:</span>
                      <span style={styles.modalInfoValue}>{pedidoSeleccionado.ubicacion}</span>
                    </div>
                  )}
                  {pedidoSeleccionado.notas && (
                    <div style={styles.modalInfoRow}>
                      <span style={styles.modalInfoLabel}>Notas:</span>
                      <span style={styles.modalInfoValue}>{pedidoSeleccionado.notas}</span>
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.modalSection}>
                <h4 style={styles.modalSectionTitle}>Total</h4>
                <div style={styles.modalTotal}>
                  ${parseFloat(pedidoSeleccionado.total || 0).toFixed(2)}
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                onClick={() => setPedidoSeleccionado(null)}
                style={styles.modalBtnClose}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
    backgroundColor: colors.gray[50],
    minHeight: '100vh'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '16px'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: `4px solid ${colors.gray[200]}`,
    borderTopColor: colors.primary,
    animation: 'spin 0.8s linear infinite'
  },
  loadingText: {
    color: colors.gray[600],
    fontSize: '16px',
    fontWeight: '500'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '24px'
  },
  errorIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  errorTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: '8px'
  },
  errorText: {
    fontSize: '16px',
    color: colors.gray[600],
    marginBottom: '24px'
  },
  retryButton: {
    background: colors.primary,
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: colors.gray[900],
    margin: 0
  },
  subtitle: {
    fontSize: '14px',
    color: colors.gray[600],
    margin: '4px 0 0 0',
    fontWeight: '500'
  },
  statsCard: {
    background: '#ffffff',
    border: `2px solid ${colors.gray[200]}`,
    padding: '16px 24px',
    display: 'flex',
    gap: '24px',
    alignItems: 'center'
  },
  statItem: {
    textAlign: 'center'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '800',
    color: colors.gray[900]
  },
  statLabel: {
    fontSize: '12px',
    color: colors.gray[600],
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginTop: '4px'
  },
  dividerVertical: {
    width: '1px',
    height: '40px',
    background: colors.gray[200]
  },
  filterBar: {
    background: '#ffffff',
    border: `2px solid ${colors.gray[200]}`,
    padding: '16px',
    marginBottom: '32px'
  },
  filterButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  filterButton: {
    background: colors.gray[100],
    color: colors.gray[700],
    border: `2px solid ${colors.gray[200]}`,
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease'
  },
  filterButtonActive: {
    background: colors.primary,
    color: '#ffffff',
    borderColor: colors.primary
  },
  filterBadge: {
    background: 'rgba(0, 0, 0, 0.1)',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: '700'
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 24px',
    background: '#ffffff',
    border: `2px solid ${colors.gray[200]}`
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: '8px'
  },
  emptyText: {
    fontSize: '14px',
    color: colors.gray[600],
    marginBottom: '24px'
  },
  btnNuevoPedido: {
    background: colors.primary,
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  pedidosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px'
  },
  pedidoCard: {
    background: '#ffffff',
    border: `2px solid ${colors.gray[200]}`,
    transition: 'all 0.2s ease'
  },
  pedidoHeader: {
    padding: '16px',
    borderBottom: `2px solid ${colors.gray[200]}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: colors.gray[50]
  },
  pedidoHeaderLeft: {},
  pedidoNumero: {
    fontSize: '18px',
    fontWeight: '800',
    color: colors.gray[900],
    marginBottom: '4px'
  },
  pedidoFecha: {
    fontSize: '12px',
    color: colors.gray[600],
    fontWeight: '500'
  },
  estadoBadge: {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '700',
    border: '2px solid',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  estadoIcono: {
    fontSize: '14px'
  },
  pedidoBody: {
    padding: '16px'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    paddingBottom: '8px',
    borderBottom: `1px solid ${colors.gray[200]}`
  },
  infoLabel: {
    fontSize: '13px',
    color: colors.gray[600],
    fontWeight: '600'
  },
  infoValue: {
    fontSize: '13px',
    color: colors.gray[900],
    fontWeight: '600',
    textAlign: 'right',
    maxWidth: '60%'
  },
  pedidoFooter: {
    padding: '16px',
    borderTop: `2px solid ${colors.gray[200]}`,
    background: colors.gray[50]
  },
  totalContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  totalLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.gray[600],
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  totalValue: {
    fontSize: '24px',
    fontWeight: '800',
    color: colors.gray[900]
  },
  pedidoActions: {
    display: 'flex',
    gap: '8px'
  },
  btnVer: {
    background: colors.primary,
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  btnCancelar: {
    background: colors.danger,
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '24px'
  },
  modal: {
    background: '#ffffff',
    border: `2px solid ${colors.gray[200]}`,
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  modalHeader: {
    padding: '24px',
    borderBottom: `2px solid ${colors.gray[200]}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: colors.gray[50]
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: colors.gray[900],
    margin: 0
  },
  modalClose: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: colors.gray[600],
    cursor: 'pointer',
    padding: '4px',
    lineHeight: 1
  },
  modalBody: {
    padding: '24px'
  },
  modalSection: {
    marginBottom: '24px'
  },
  modalSectionTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: colors.gray[700],
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '12px'
  },
  modalInfo: {
    background: colors.gray[50],
    border: `1px solid ${colors.gray[200]}`,
    padding: '16px'
  },
  modalInfoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: `1px solid ${colors.gray[200]}`
  },
  modalInfoLabel: {
    fontSize: '14px',
    color: colors.gray[600],
    fontWeight: '600'
  },
  modalInfoValue: {
    fontSize: '14px',
    color: colors.gray[900],
    fontWeight: '600',
    textAlign: 'right'
  },
  modalTotal: {
    fontSize: '32px',
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    padding: '16px',
    background: colors.gray[50],
    border: `2px solid ${colors.gray[200]}`
  },
  modalFooter: {
    padding: '16px 24px',
    borderTop: `2px solid ${colors.gray[200]}`,
    background: colors.gray[50]
  },
  modalBtnClose: {
    background: colors.gray[300],
    color: colors.gray[900],
    border: 'none',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    width: '100%',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }
};

// Keyframes
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default MisPedidosPage;