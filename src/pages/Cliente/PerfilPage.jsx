// src/pages/PerfilPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaLock, 
  FaSave, 
  FaEdit, 
  FaTimes,
  FaKey,
  FaHistory,
  FaClipboardCheck,
  FaCheckCircle,
  FaUserShield
} from 'react-icons/fa';

// Paleta de colores
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

// Importar servicios desde api.js
import { usuarioService, pedidoService } from '../../services/api';

const PerfilPage = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Estados para formularios
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  
  // Datos del perfil
  const [perfilData, setPerfilData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    fecha_registro: ''
  });
  
  // Formulario de edición
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  });
  
  // Formulario de cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Datos de pedidos
  const [misPedidos, setMisPedidos] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    enPreparacion: 0,
    listos: 0,
    entregados: 0,
    cancelados: 0
  });

  // Cargar datos iniciales
  useEffect(() => {
    if (user) {
      cargarDatosUsuario();
      cargarMisPedidos();
    }
  }, [user]);

  // Cargar datos del usuario desde el contexto y API
  const cargarDatosUsuario = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Primero usar datos del contexto
      const userData = {
        nombre: user?.nombre || '',
        email: user?.email || '',
        telefono: user?.telefono || '',
        direccion: user?.direccion || '',
        fecha_registro: user?.fecha_registro || user?.created_at || ''
      };
      
      setPerfilData(userData);
      setFormData({
        nombre: userData.nombre,
        email: userData.email,
        telefono: userData.telefono || '',
        direccion: userData.direccion || ''
      });
      
      // Opcional: Si quieres datos más completos de la API
      try {
        const result = await usuarioService.getPerfil();
        if (result.data) {
          const apiData = result.data;
          const completeData = {
            nombre: apiData.nombre || userData.nombre,
            email: apiData.email || userData.email,
            telefono: apiData.telefono || userData.telefono,
            direccion: apiData.direccion || userData.direccion,
            fecha_registro: apiData.fecha_registro || apiData.created_at || userData.fecha_registro
          };
          
          setPerfilData(completeData);
          setFormData({
            nombre: completeData.nombre,
            email: completeData.email,
            telefono: completeData.telefono || '',
            direccion: completeData.direccion || ''
          });
        }
      } catch (apiError) {
        console.log('API de perfil no disponible, usando datos del contexto');
      }
      
    } catch (err) {
      setError('Error al cargar los datos del perfil');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar pedidos del usuario
  const cargarMisPedidos = async () => {
    try {
      if (!user?.id) return;
      
      const result = await pedidoService.getByCliente(user.id);
      
      // Manejar diferentes estructuras de respuesta
      let pedidos = [];
      
      if (result.data?.success && result.data?.data) {
        pedidos = result.data.data;
      } else if (result.data?.data) {
        pedidos = result.data.data;
      } else if (Array.isArray(result.data)) {
        pedidos = result.data;
      }
      
      // Ordenar por fecha (más recientes primero)
      const pedidosOrdenados = pedidos.sort((a, b) => 
        new Date(b.fecha_pedido || b.created_at) - new Date(a.fecha_pedido || a.created_at)
      );
      
      setMisPedidos(pedidosOrdenados.slice(0, 5)); // Solo últimos 5 pedidos
      
      // Calcular estadísticas
      const estadisticas = {
        total: pedidos.length,
        pendientes: pedidos.filter(p => p.estado === 'pendiente').length,
        enPreparacion: pedidos.filter(p => p.estado === 'en_preparacion').length,
        listos: pedidos.filter(p => p.estado === 'listo').length,
        entregados: pedidos.filter(p => p.estado === 'entregado').length,
        cancelados: pedidos.filter(p => p.estado === 'cancelado').length
      };
      
      setStats(estadisticas);
      
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
      // No mostrar error al usuario para no interrumpir la experiencia
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambios en el formulario de contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Guardar cambios del perfil
  const guardarPerfil = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Llamar a la API para actualizar el perfil
      const result = await usuarioService.update(user.id, formData);
      
      if (result.data?.success) {
        // Actualizar datos locales
        setPerfilData(formData);
        setEditMode(false);
        setSuccess('Perfil actualizado exitosamente');
        
        // Actualizar usuario en contexto de autenticación
        updateUser({ ...user, ...formData });
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(result.data?.message || 'Error al actualizar el perfil');
      }
    } catch (err) {
      console.error('Error actualizando perfil:', err);
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  // Cambiar contraseña
  const cambiarPassword = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Llamar al endpoint para cambiar contraseña
      // NOTA: Asumo que tu API tiene un endpoint para esto
      // Si no lo tienes, necesitarías agregarlo
      const response = await fetch('http://localhost:3000/api/usuarios/cambiar-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSuccess('Contraseña cambiada exitosamente');
        setChangePasswordMode(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(result.message || 'Error al cambiar la contraseña');
      }
    } catch (err) {
      console.error('Error cambiando contraseña:', err);
      setError(err.message || 'Error al cambiar la contraseña');
    } finally {
      setSaving(false);
    }
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setFormData({
      nombre: perfilData.nombre,
      email: perfilData.email,
      telefono: perfilData.telefono || '',
      direccion: perfilData.direccion || ''
    });
    setEditMode(false);
    setError(null);
  };

  // Cancelar cambio de contraseña
  const cancelarCambioPassword = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setChangePasswordMode(false);
    setError(null);
  };

  // Formatear fecha
  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'No disponible';
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Obtener color según estado del pedido
  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: colors.warning,
      en_preparacion: colors.info,
      listo: colors.primaryLight,
      entregado: colors.success,
      cancelado: colors.danger
    };
    return colores[estado] || colors.gray[500];
  };

  // Formatear estado
  const formatEstado = (estado) => {
    const estados = {
      pendiente: 'Pendiente',
      en_preparacion: 'En Preparación',
      listo: 'Listo',
      entregado: 'Entregado',
      cancelado: 'Cancelado'
    };
    return estados[estado] || estado;
  };

  // Ver detalle del pedido
  const verDetallePedido = (pedidoId) => {
    navigate(`/pedidos/${pedidoId}`);
  };

  // Si no hay usuario, redirigir al login
  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <div>Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Mi Perfil</h1>
          <p style={styles.subtitle}>Administra tu información personal y preferencias</p>
        </div>
      </div>

      {/* Mensajes de error/success */}
      {error && (
        <div style={styles.messageError}>
          <div style={styles.messageContent}>
            <span>{error}</span>
            <button onClick={() => setError(null)} style={styles.messageClose}>
              ×
            </button>
          </div>
        </div>
      )}
      
      {success && (
        <div style={styles.messageSuccess}>
          <div style={styles.messageContent}>
            <span>{success}</span>
            <button onClick={() => setSuccess(null)} style={styles.messageClose}>
              ×
            </button>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div style={styles.contentGrid}>
        {/* Columna izquierda: Información del perfil */}
        <div style={styles.leftColumn}>
          {/* Tarjeta de información */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Información Personal</h2>
              {!editMode && !changePasswordMode && (
                <button
                  onClick={() => setEditMode(true)}
                  style={styles.editButton}
                >
                  <FaEdit style={{ marginRight: 8 }} />
                  Editar
                </button>
              )}
            </div>
            
            {editMode ? (
              <form onSubmit={guardarPerfil} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nombre Completo *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Dirección</label>
                  <textarea
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    rows="3"
                    style={styles.textarea}
                  />
                </div>
                
                <div style={styles.formActions}>
                  <button
                    type="button"
                    onClick={cancelarEdicion}
                    disabled={saving}
                    style={styles.cancelButton}
                  >
                    <FaTimes style={{ marginRight: 8 }} />
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={styles.saveButton}
                  >
                    <FaSave style={{ marginRight: 8 }} />
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            ) : (
              <div style={styles.cardContent}>
                <div style={styles.infoItem}>
                  <div style={styles.infoIcon}>
                    <FaUser />
                  </div>
                  <div style={styles.infoContent}>
                    <div style={styles.infoLabel}>Nombre</div>
                    <div style={styles.infoValue}>{perfilData.nombre}</div>
                  </div>
                </div>
                
                <div style={styles.infoItem}>
                  <div style={styles.infoIcon}>
                    <FaEnvelope />
                  </div>
                  <div style={styles.infoContent}>
                    <div style={styles.infoLabel}>Email</div>
                    <div style={styles.infoValue}>{perfilData.email}</div>
                  </div>
                </div>
                
                <div style={styles.infoItem}>
                  <div style={styles.infoIcon}>
                    <FaPhone />
                  </div>
                  <div style={styles.infoContent}>
                    <div style={styles.infoLabel}>Teléfono</div>
                    <div style={styles.infoValue}>
                      {perfilData.telefono || 'No especificado'}
                    </div>
                  </div>
                </div>
                
                <div style={styles.infoItem}>
                  <div style={styles.infoIcon}>
                    <FaMapMarkerAlt />
                  </div>
                  <div style={styles.infoContent}>
                    <div style={styles.infoLabel}>Dirección</div>
                    <div style={styles.infoValue}>
                      {perfilData.direccion || 'No especificada'}
                    </div>
                  </div>
                </div>
                
                <div style={styles.infoItem}>
                  <div style={styles.infoIcon}>
                    <FaCalendarAlt />
                  </div>
                  <div style={styles.infoContent}>
                    <div style={styles.infoLabel}>Miembro desde</div>
                    <div style={styles.infoValue}>
                      {formatearFecha(perfilData.fecha_registro)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tarjeta de cambio de contraseña */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Seguridad</h2>
              {!changePasswordMode && !editMode && (
                <button
                  onClick={() => setChangePasswordMode(true)}
                  style={styles.editButton}
                >
                  <FaKey style={{ marginRight: 8 }} />
                  Cambiar Contraseña
                </button>
              )}
            </div>
            
            {changePasswordMode ? (
              <form onSubmit={cambiarPassword} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Contraseña Actual *</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nueva Contraseña *</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength="6"
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Confirmar Nueva Contraseña *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formActions}>
                  <button
                    type="button"
                    onClick={cancelarCambioPassword}
                    disabled={saving}
                    style={styles.cancelButton}
                  >
                    <FaTimes style={{ marginRight: 8 }} />
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={styles.saveButton}
                  >
                    <FaLock style={{ marginRight: 8 }} />
                    {saving ? 'Cambiando...' : 'Cambiar Contraseña'}
                  </button>
                </div>
              </form>
            ) : (
              <div style={styles.cardContent}>
                <div style={styles.securityInfo}>
                  <FaKey style={{ fontSize: 48, color: colors.gray[300], marginBottom: 16 }} />
                  <p style={styles.securityText}>
                    Protege tu cuenta con una contraseña segura
                  </p>
                  <p style={styles.securityHint}>
                    Recomendamos cambiar tu contraseña periódicamente
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Columna derecha: Pedidos y estadísticas */}
        <div style={styles.rightColumn}>
          {/* Estadísticas de pedidos */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Mis Pedidos</h2>
              {misPedidos.length > 0 && (
                <button
                  onClick={() => navigate('/pedidos/cliente')}
                  style={styles.viewAllButton}
                >
                  Ver Todos
                </button>
              )}
            </div>
            <div style={styles.cardContent}>
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <div style={styles.statIcon}>
                    <FaClipboardCheck />
                  </div>
                  <div style={styles.statContent}>
                    <div style={styles.statValue}>{stats.total}</div>
                    <div style={styles.statLabel}>Total</div>
                  </div>
                </div>
                
                <div style={styles.statCard}>
                  <div style={{ ...styles.statIcon, color: colors.success }}>
                    <FaCheckCircle />
                  </div>
                  <div style={styles.statContent}>
                    <div style={styles.statValue}>{stats.entregados}</div>
                    <div style={styles.statLabel}>Entregados</div>
                  </div>
                </div>
                
                <div style={styles.statCard}>
                  <div style={{ ...styles.statIcon, color: colors.warning }}>
                    <FaHistory />
                  </div>
                  <div style={styles.statContent}>
                    <div style={styles.statValue}>{stats.pendientes + stats.enPreparacion}</div>
                    <div style={styles.statLabel}>Activos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pedidos recientes */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Pedidos Recientes</h2>
            </div>
            <div style={styles.cardContent}>
              {misPedidos.length === 0 ? (
                <div style={styles.emptyOrders}>
                  <FaClipboardCheck style={styles.emptyIcon} />
                  <p style={styles.emptyText}>No has realizado pedidos aún</p>
                  <button
                    onClick={() => navigate('/menu')}
                    style={styles.browseMenuButton}
                  >
                    Ver Menú
                  </button>
                </div>
              ) : (
                <div style={styles.ordersList}>
                  {misPedidos.map(pedido => (
                    <div 
                      key={pedido.id} 
                      style={styles.orderItem}
                      onClick={() => verDetallePedido(pedido.id)}
                    >
                      <div style={styles.orderInfo}>
                        <div style={styles.orderNumber}>
                          #{pedido.numero_pedido || pedido.id}
                        </div>
                        <div style={styles.orderDate}>
                          {formatearFecha(pedido.fecha_pedido || pedido.created_at)}
                        </div>
                        <div style={styles.orderTotal}>
                          ${parseFloat(pedido.total || 0).toFixed(2)}
                        </div>
                      </div>
                      <div style={styles.orderStatus}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: getEstadoColor(pedido.estado) + '20',
                          color: getEstadoColor(pedido.estado)
                        }}>
                          {formatEstado(pedido.estado)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Información de la cuenta */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Información de la Cuenta</h2>
            </div>
            <div style={styles.cardContent}>
              <div style={styles.accountInfo}>
                <div style={styles.accountItem}>
                  <div style={styles.accountLabel}>Tipo de Cuenta</div>
                  <div style={styles.accountValue}>
                    {user?.rol === 'administrador' ? 'Administrador' : 
                     user?.rol === 'cliente' ? 'Cliente' : 
                     user?.rol || 'Usuario'}
                  </div>
                </div>
                
                <div style={styles.accountItem}>
                  <div style={styles.accountLabel}>Estado</div>
                  <div style={styles.accountValue}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: user?.activo ? colors.success + '20' : colors.danger + '20',
                      color: user?.activo ? colors.success : colors.danger
                    }}>
                      {user?.activo ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                </div>
                
                <div style={styles.accountItem}>
                  <div style={styles.accountLabel}>ID de Usuario</div>
                  <div style={styles.accountValue}>
                    {user?.id || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Los estilos permanecen iguales...
const styles = {
  container: {
    padding: '24px',
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
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: `3px solid ${colors.gray[200]}`,
    borderTopColor: colors.primary,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  header: {
    marginBottom: '32px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: colors.gray[900],
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: colors.gray[600],
    margin: 0
  },
  messageError: {
    backgroundColor: colors.danger + '10',
    border: `1px solid ${colors.danger}30`,
    color: colors.danger,
    padding: '16px',
    marginBottom: '24px'
  },
  messageSuccess: {
    backgroundColor: colors.success + '10',
    border: `1px solid ${colors.success}30`,
    color: colors.success,
    padding: '16px',
    marginBottom: '24px'
  },
  messageContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  messageClose: {
    background: 'none',
    border: 'none',
    color: 'inherit',
    fontSize: '20px',
    cursor: 'pointer',
    padding: 0,
    lineHeight: 1
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '24px'
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  card: {
    backgroundColor: '#ffffff',
    border: `1px solid ${colors.gray[200]}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  cardHeader: {
    padding: '20px',
    borderBottom: `1px solid ${colors.gray[200]}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: colors.gray[900],
    margin: 0
  },
  cardContent: {
    padding: '20px'
  },
  editButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: colors.gray[100],
    color: colors.gray[700],
    border: `1px solid ${colors.gray[300]}`,
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: colors.gray[200]
    }
  },
  form: {
    padding: '20px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: colors.gray[700]
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${colors.gray[300]}`,
    fontSize: '14px',
    outline: 'none',
    ':focus': {
      borderColor: colors.primary
    }
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${colors.gray[300]}`,
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    minHeight: '80px',
    ':focus': {
      borderColor: colors.primary
    }
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: colors.gray[200],
    color: colors.gray[700],
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    ':hover': {
      backgroundColor: colors.gray[300]
    }
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: colors.primary,
    color: '#ffffff',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    ':hover': {
      backgroundColor: colors.primaryLight
    }
  },
  infoItem: {
    display: 'flex',
    gap: '16px',
    padding: '12px 0',
    borderBottom: `1px solid ${colors.gray[200]}`,
    ':last-child': {
      borderBottom: 'none'
    }
  },
  infoIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: colors.gray[100],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.primary,
    flexShrink: 0
  },
  infoContent: {
    flex: 1
  },
  infoLabel: {
    fontSize: '12px',
    color: colors.gray[500],
    marginBottom: '4px',
    fontWeight: '500'
  },
  infoValue: {
    fontSize: '15px',
    color: colors.gray[900],
    fontWeight: '500'
  },
  securityInfo: {
    textAlign: 'center',
    padding: '20px 0'
  },
  securityText: {
    fontSize: '15px',
    color: colors.gray[700],
    marginBottom: '8px'
  },
  securityHint: {
    fontSize: '13px',
    color: colors.gray[500]
  },
  viewAllButton: {
    padding: '8px 16px',
    backgroundColor: colors.gray[100],
    color: colors.gray[700],
    border: `1px solid ${colors.gray[300]}`,
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: colors.gray[200]
    }
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px'
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: colors.gray[50],
    border: `1px solid ${colors.gray[200]}`
  },
  statIcon: {
    fontSize: '20px',
    color: colors.primary
  },
  statContent: {},
  statValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: '2px'
  },
  statLabel: {
    fontSize: '12px',
    color: colors.gray[500],
    fontWeight: '500'
  },
  emptyOrders: {
    textAlign: 'center',
    padding: '40px 20px'
  },
  emptyIcon: {
    fontSize: '48px',
    color: colors.gray[300],
    marginBottom: '16px'
  },
  emptyText: {
    fontSize: '15px',
    color: colors.gray[500],
    marginBottom: '20px'
  },
  browseMenuButton: {
    padding: '10px 20px',
    backgroundColor: colors.primary,
    color: '#ffffff',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: colors.primaryLight
    }
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: colors.gray[50],
    border: `1px solid ${colors.gray[200]}`,
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: colors.gray[100]
    }
  },
  orderInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  orderNumber: {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.gray[900]
  },
  orderDate: {
    fontSize: '12px',
    color: colors.gray[500]
  },
  orderTotal: {
    fontSize: '14px',
    fontWeight: '700',
    color: colors.gray[900]
  },
  orderStatus: {},
  statusBadge: {
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '600',
    borderRadius: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  accountInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  accountItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '8px',
    borderBottom: `1px solid ${colors.gray[200]}`,
    ':last-child': {
      borderBottom: 'none'
    }
  },
  accountLabel: {
    fontSize: '14px',
    color: colors.gray[600],
    fontWeight: '500'
  },
  accountValue: {
    fontSize: '14px',
    color: colors.gray[900],
    fontWeight: '500'
  }
};

// Agregar animación del spinner
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default PerfilPage;