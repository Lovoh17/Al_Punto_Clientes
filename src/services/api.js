// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-alpunto-production.up.railway.app/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicio de Categorías
export const categoriaService = {
  getAll: () => api.get('/categorias'),
  getById: (id) => api.get(`/categorias/${id}`),
  create: (categoria) => api.post('/categorias', categoria),
  update: (id, categoria) => api.put(`/categorias/${id}`, categoria),
  delete: (id) => api.delete(`/categorias/${id}`),
};

// Servicio de Productos
export const productoService = {
  getAll: () => api.get('/productos'),
  getById: (id) => api.get(`/productos/${id}`),
  getByCategoria: (categoriaId) => api.get(`/productos?categoria_id=${categoriaId}&disponible=true`),
  create: (producto) => api.post('/productos', producto),
  update: (id, producto) => api.put(`/productos/${id}`, producto),
  delete: (id) => api.delete(`/productos/${id}`),
};

export const pedidoService = {
  getAll: () => api.get('/Pedidos'),
  getById: (id) => api.get(`/Pedidos/${id}`),
  getActivos: () => api.get('/Pedidos/activos'),
  getByCliente: (usuarioId) => api.get(`/Pedidos/cliente/${usuarioId}`),
  getByNumero: (numeroPedido) => api.get(`/Pedidos/numero/${numeroPedido}`),
  getEstadisticas: () => api.get('/Pedidos/estadisticas'),
  getReporteVentas: () => api.get('/Pedidos/reportes/ventas'),
  crear: (pedidoData) => api.post('/Pedidos', pedidoData),
  update: (id, pedido) => api.put(`/Pedidos/${id}`, pedido),
  cambiarEstado: (id, estado) => api.patch(`/Pedidos/${id}/estado`, { estado }),
  cancelar: (id) => api.patch(`/Pedidos/${id}/cancelar`),
  delete: (id) => api.delete(`/Pedidos/${id}`),
};

// 🎯 Servicio de Pedidos_Productos (SIMPLIFICADO - según estructura real)
export const pedidosProductosService = {
  // Obtener productos de un pedido específico
  obtenerProductosPedido: (pedidoId) => 
    api.get(`/Pedidos_Productos/${pedidoId}/productos`),
  
  // Agregar múltiples productos a un pedido
  agregarProductos: (pedidoId, productos) => 
    api.post(`/Pedidos_Productos/${pedidoId}/productos/multiples`, { productos }),
  
  // Actualizar cantidad de un item
  actualizarCantidad: (itemId, cantidad) => 
    api.patch(`/Pedidos_Productos/${itemId}/cantidad`, { cantidad }),
  
  // Actualizar notas de un item
  actualizarNotas: (itemId, notas) => 
    api.patch(`/Pedidos_Productos/${itemId}/notas`, { notas }),
  
  // Eliminar producto del pedido
  eliminarProducto: (itemId) => 
    api.delete(`/Pedidos_Productos/${itemId}`),
};

// Servicio de Usuarios
export const usuarioService = {
  login: (credenciales) => api.post('/usuarios/login', credenciales),
  getPerfil: () => api.get('/usuarios/perfil'),
  syncFirebaseUser: async (userData) => {
    return await api.post('/usuarios/sync-firebase', userData);
  },
  
  registro: async (userData) => {
    const dataToSend = userData.provider === 'google.com' ? {
      email: userData.email,
      nombre: userData.nombre,
      foto: userData.foto,
      uid: userData.uid,
      provider: userData.provider,
      password: 'google-auth', 
      firebaseToken: userData.firebaseToken
    } : userData;
    
    return await api.post('/usuarios/registro', dataToSend);
  },
};

// 🎯 Servicios para el cliente (ACTUALIZADO)
export const clienteService = {
  // Obtener menú del día
  getMenuHoy: () => api.get('/Menu_Dias/hoy'),
  
  // Obtener categorías activas
  getCategoriasActivas: () => api.get('/categorias?activo=true'),
  
  // Obtener productos por categoría
  getProductosPorCategoria: (categoriaId) => 
    api.get(`/productos?categoria_id=${categoriaId}&disponible=true`),
  
  getProductosDisponibles: () => 
    api.get('/productos?disponible=true'),
  
  crearPedidoCompleto: (datosCarrito) => {
    return api.post('/Pedidos', {
      usuario_id: datosCarrito.usuario_id,
      numero_mesa: datosCarrito.numero_mesa || null,
      ubicacion: datosCarrito.ubicacion || null,
      notas: datosCarrito.notas || '',
      productos: datosCarrito.items.map(item => ({
        producto_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
        notas: item.notas || ''
      }))
    });
  },
};

export const menuDiasService = {
  getAll: () => api.get('/Menu_Dias'),
  getHoy: () => api.get('/Menu_Dias/hoy'),
  getProximos: () => api.get('/Menu_Dias/proximos'),
  getById: (id) => api.get(`/Menu_Dias/${id}`),
  getByFecha: (fecha) => api.get(`/Menu_Dias/fecha/${fecha}`),
  getProductos: (menuId) => api.get(`/Menu_Dias/${menuId}/productos`),
  create: (menuData) => api.post('/Menu_Dias', menuData),
  update: (id, menuData) => api.put(`/Menu_Dias/${id}`, menuData),
  agregarProductos: (menuId, productos) => api.post(`/Menu_Dias/${menuId}/productos`, { productos }),
  delete: (id) => api.delete(`/Menu_Dias/${id}`),
  getEstadisticas: () => api.get('/Menu_Dias/estadisticas'),
  getProductosPopulares: () => api.get('/Menu_Dias/productos-populares'),
};

export const menuDiasProductosService = {
  // Obtener productos por menú
  getProductosPorMenu: (menuId) => api.get(`/Menu_dias_Productos/menu-dias/${menuId}/productos`),
  
  // Obtener por categoría
  getPorCategoria: (menuId, categoriaId) => api.get(`/Menu_dias_Productos/menu-dias/${menuId}/productos/categoria/${categoriaId}`),
  
  // Obtener estadísticas
  getEstadisticas: (menuId) => api.get(`/Menu_dias_Productos/menu-dias/${menuId}/productos/estadisticas`),
  
  // Agregar múltiples productos
  agregarMultiples: (menuId, productos) => api.post(`/Menu_dias_Productos/menu-dias/${menuId}/productos/multiples`, { productos }),
  
  // Agregar producto
  agregarProducto: (menuId, producto) => api.post(`/Menu_dias_Productos/menu-dias/${menuId}/productos`, producto),
  
  // Cambiar disponibilidad
  cambiarDisponibilidad: (itemId, disponible) => api.patch(`/Menu_dias_Productos/${itemId}/disponibilidad`, { disponible }),
  
  // Copiar menú
  copiarMenu: (menuId, datosCopia) => api.post(`/Menu_dias_Productos/menu-dias/${menuId}/copiar`, datosCopia),
  
  // Activar todos los productos
  activarTodos: (menuId) => api.patch(`/Menu_dias_Productos/menu-dias/${menuId}/productos/activar-todos`),
  
  // Desactivar todos los productos
  desactivarTodos: (menuId) => api.patch(`/Menu_dias_Productos/menu-dias/${menuId}/productos/desactivar-todos`),
  
  // Limpiar menú (eliminar todos los productos)
  limpiarMenu: (menuId) => api.delete(`/Menu_dias_Productos/menu-dias/${menuId}/productos`),
  
  // Eliminar producto del menú
  eliminarProducto: (itemId) => api.delete(`/Menu_dias_Productos/${itemId}`),
};



export default api;

