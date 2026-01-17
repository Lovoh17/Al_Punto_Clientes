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
  FaUserShield,
  FaBars,
  FaArrowLeft
} from 'react-icons/fa';

// Paleta de colores minimalista
const colors = {
  primary: '#000000',
  primaryLight: '#333333',
  secondary: '#E74C3C',
  success: '#689F38',
  warning: '#FF9800',
  danger: '#D32F2F',
  info: '#1976D2',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121'
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
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

  // Detectar cambios en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowMobileMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      const response = await fetch('https://backend-alpunto-production.up.railway.app/api/usuarios/cambiar-password', {
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
        <div style={styles.loadingText}>Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header Móvil */}
      {isMobile && (
        <header style={styles.mobileHeader}>
          <div style={styles.mobileHeaderLeft}>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              style={styles.mobileMenuButton}
            >
              {showMobileMenu ? <FaArrowLeft /> : <FaBars />}
            </button>
          </div>
          <div style={styles.mobileHeaderCenter}>
            <h1 style={styles.mobileTitle}>Mi Perfil</h1>
          </div>
          <div style={styles.mobileHeaderRight} />
        </header>
      )}

      {/* Header Desktop */}
      {!isMobile && (
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Mi Perfil</h1>
            <p style={styles.subtitle}>Administra tu información personal y preferencias</p>
          </div>
        </div>
      )}

      {/* Mensajes de error/success */}
      {error && (
        <div style={styles.messageError}>
          <div style={styles.messageContent}>
            <span style={styles.messageText}>{error}</span>
            <button onClick={() => setError(null)} style={styles.messageClose}>
              ×
            </button>
          </div>
        </div>
      )}
      
      {success && (
        <div style={styles.messageSuccess}>
          <div style={styles.messageContent}>
            <span style={styles.messageText}>{success}</span>
            <button onClick={() => setSuccess(null)} style={styles.messageClose}>
              ×
            </button>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div style={{
        ...styles.contentGrid,
        gridTemplateColumns: isMobile ? '1fr' : '1fr 380px',
        gap: isMobile ? '16px' : '24px'
      }}>
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
                  <FaEdit style={styles.buttonIcon} />
                  {!isMobile && 'Editar'}
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
                
                <div style={{
                  ...styles.formActions,
                  flexDirection: isMobile ? 'column' : 'row'
                }}>
                  <button
                    type="button"
                    onClick={cancelarEdicion}
                    disabled={saving}
                    style={{
                      ...styles.cancelButton,
                      width: isMobile ? '100%' : 'auto',
                      marginBottom: isMobile ? '8px' : '0'
                    }}
                  >
                    <FaTimes style={styles.buttonIcon} />
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      ...styles.saveButton,
                      width: isMobile ? '100%' : 'auto'
                    }}
                  >
                    <FaSave style={styles.buttonIcon} />
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
                  <FaKey style={styles.buttonIcon} />
                  {!isMobile && 'Cambiar Contraseña'}
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
                
                <div style={{
                  ...styles.formActions,
                  flexDirection: isMobile ? 'column' : 'row'
                }}>
                  <button
                    type="button"
                    onClick={cancelarCambioPassword}
                    disabled={saving}
                    style={{
                      ...styles.cancelButton,
                      width: isMobile ? '100%' : 'auto',
                      marginBottom: isMobile ? '8px' : '0'
                    }}
                  >
                    <FaTimes style={styles.buttonIcon} />
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      ...styles.saveButton,
                      width: isMobile ? '100%' : 'auto'
                    }}
                  >
                    <FaLock style={styles.buttonIcon} />
                    {saving ? 'Cambiando...' : 'Cambiar Contraseña'}
                  </button>
                </div>
              </form>
            ) : (
              <div style={styles.cardContent}>
                <div style={styles.securityInfo}>
                  <FaKey style={styles.securityIcon} />
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

        {/* Columna derecha: Pedidos y estadísticas - En móvil se muestra después del contenido principal */}
        <div style={isMobile && showMobileMenu ? { display: 'none' } : styles.rightColumn}>
          {/* Estadísticas de pedidos */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Mis Pedidos</h2>
              {misPedidos.length > 0 && (
                <button
                  onClick={() => navigate('/pedidos/cliente')}
                  style={styles.viewAllButton}
                >
                  {isMobile ? 'Ver Todos' : 'Ver Todos'}
                </button>
              )}
            </div>
            <div style={styles.cardContent}>
              <div style={{
                ...styles.statsGrid,
                gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)',
                gap: isMobile ? '8px' : '16px'
              }}>
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
                          backgroundColor: getEstadoColor(pedido.estado) + '10',
                          borderColor: getEstadoColor(pedido.estado) + '40',
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
                      backgroundColor: user?.activo ? colors.success + '10' : colors.danger + '10',
                      borderColor: user?.activo ? colors.success + '40' : colors.danger + '40',
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

// Estilos minimalistas sin bordes redondeados, sombras ni gradientes
const styles = {
  container: {
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
    border: `2px solid ${colors.gray[300]}`,
    borderTopColor: colors.primary,
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    fontSize: '14px',
    color: colors.gray[600]
  },
  mobileHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderBottom: `1px solid ${colors.gray[200]}`,
    padding: '16px',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  mobileHeaderLeft: {
    width: '40px'
  },
  mobileHeaderCenter: {
    flex: 1,
    textAlign: 'center'
  },
  mobileHeaderRight: {
    width: '40px'
  },
  mobileMenuButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    color: colors.gray[800],
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px'
  },
  mobileTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: colors.gray[900],
    margin: 0
  },
  header: {
    padding: '24px',
    marginBottom: '32px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: colors.gray[900],
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: '14px',
    color: colors.gray[600],
    margin: 0
  },
  messageError: {
    backgroundColor: colors.danger + '08',
    border: `1px solid ${colors.danger}20`,
    color: colors.danger,
    padding: '16px',
    margin: '0 16px 16px',
    marginTop: '16px'
  },
  messageSuccess: {
    backgroundColor: colors.success + '08',
    border: `1px solid ${colors.success}20`,
    color: colors.success,
    padding: '16px',
    margin: '0 16px 16px',
    marginTop: '16px'
  },
  messageContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  messageText: {
    fontSize: '14px'
  },
  messageClose: {
    background: 'none',
    border: 'none',
    color: 'inherit',
    fontSize: '20px',
    cursor: 'pointer',
    padding: 0,
    lineHeight: 1,
    opacity: 0.7,
    ':hover': {
      opacity: 1
    }
  },
  contentGrid: {
    display: 'grid',
    padding: '16px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  card: {
    backgroundColor: '#ffffff',
    border: `1px solid ${colors.gray[200]}`
  },
  cardHeader: {
    padding: '20px',
    borderBottom: `1px solid ${colors.gray[200]}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: colors.gray[900],
    margin: 0
  },
  cardContent: {
    padding: '20px'
  },
  buttonIcon: {
    marginRight: '8px'
  },
  editButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: 'transparent',
    color: colors.gray[700],
    border: `1px solid ${colors.gray[300]}`,
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: colors.gray[100]
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
    marginBottom: '6px',
    fontSize: '12px',
    fontWeight: '500',
    color: colors.gray[700],
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: `1px solid ${colors.gray[300]}`,
    fontSize: '14px',
    backgroundColor: colors.gray[50],
    color: colors.gray[900],
    outline: 'none',
    transition: 'border-color 0.2s',
    ':focus': {
      borderColor: colors.primary
    }
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: `1px solid ${colors.gray[300]}`,
    fontSize: '14px',
    backgroundColor: colors.gray[50],
    color: colors.gray[900],
    outline: 'none',
    resize: 'vertical',
    minHeight: '80px',
    transition: 'border-color 0.2s',
    ':focus': {
      borderColor: colors.primary
    }
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px'
  },
  cancelButton: {
    padding: '12px 20px',
    backgroundColor: colors.gray[100],
    color: colors.gray[700],
    border: `1px solid ${colors.gray[300]}`,
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: colors.gray[200]
    },
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  },
  saveButton: {
    padding: '12px 20px',
    backgroundColor: colors.primary,
    color: '#ffffff',
    border: `1px solid ${colors.primary}`,
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: colors.primaryLight
    },
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  },
  infoItem: {
    display: 'flex',
    gap: '12px',
    padding: '16px 0',
    borderBottom: `1px solid ${colors.gray[200]}`,
    ':last-child': {
      borderBottom: 'none'
    }
  },
  infoIcon: {
    width: '36px',
    height: '36px',
    backgroundColor: colors.gray[100],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.primary,
    flexShrink: 0,
    fontSize: '14px'
  },
  infoContent: {
    flex: 1
  },
  infoLabel: {
    fontSize: '11px',
    color: colors.gray[500],
    marginBottom: '4px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  infoValue: {
    fontSize: '14px',
    color: colors.gray[900],
    fontWeight: '500'
  },
  securityInfo: {
    textAlign: 'center',
    padding: '16px 0'
  },
  securityIcon: {
    fontSize: '32px',
    color: colors.gray[300],
    marginBottom: '12px'
  },
  securityText: {
    fontSize: '14px',
    color: colors.gray[700],
    marginBottom: '8px',
    fontWeight: '500'
  },
  securityHint: {
    fontSize: '12px',
    color: colors.gray['500']
  },
  viewAllButton: {
    padding: '8px 12px',
    backgroundColor: 'transparent',
    color: colors.gray[700],
    border: `1px solid ${colors.gray[300]}`,
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: colors.gray[100]
    }
  },
  statsGrid: {
    display: 'grid',
    gap: '8px'
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    backgroundColor: colors.gray[50],
    border: `1px solid ${colors.gray[200]}`
  },
  statIcon: {
    fontSize: '18px',
    color: colors.primary
  },
  statContent: {
    flex: 1
  },
  statValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: '2px'
  },
  statLabel: {
    fontSize: '11px',
    color: colors.gray[500],
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  emptyOrders: {
    textAlign: 'center',
    padding: '32px 16px'
  },
  emptyIcon: {
    fontSize: '32px',
    color: colors.gray[300],
    marginBottom: '12px'
  },
  emptyText: {
    fontSize: '14px',
    color: colors.gray['500'],
    marginBottom: '16px'
  },
  browseMenuButton: {
    padding: '12px 20px',
    backgroundColor: colors.primary,
    color: '#ffffff',
    border: `1px solid ${colors.primary}`,
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: colors.primaryLight
    }
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
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
      backgroundColor: colors.gray[100],
      borderColor: colors.gray[300]
    }
  },
  orderInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  orderNumber: {
    fontSize: '13px',
    fontWeight: '600',
    color: colors.gray[900]
  },
  orderDate: {
    fontSize: '11px',
    color: colors.gray[500]
  },
  orderTotal: {
    fontSize: '13px',
    fontWeight: '700',
    color: colors.gray[900]
  },
  orderStatus: {
    flexShrink: 0
  },
  statusBadge: {
    padding: '4px 8px',
    fontSize: '10px',
    fontWeight: '600',
    border: `1px solid`,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  accountInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  accountItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '12px',
    borderBottom: `1px solid ${colors.gray[200]}`,
    ':last-child': {
      borderBottom: 'none',
      paddingBottom: 0
    }
  },
  accountLabel: {
    fontSize: '12px',
    color: colors.gray[600],
    fontWeight: '500'
  },
  accountValue: {
    fontSize: '12px',
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