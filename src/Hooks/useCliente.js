// src/Hooks/useCliente.js
import { useState, useEffect } from 'react';
import { clienteService } from '../services/api';
import { useAuth } from '../AuthContext';

export const useCliente = () => {
  const { user } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState('todos');

  // ✅ PUNTOS DE ENTREGA PREDEFINIDOS
const puntosEntrega = [
    { 
        id: 1, 
        nombre: 'Vidri Carretera a Cuco', 
        direccion: 'Vidri, Carretera a Cuco, San Miguel' 
    },
    { 
        id: 2, 
        nombre: 'Vidri Panamericana', 
        direccion: 'Vidri, Carretara Panamericana, Salida San Miguel' 
    },
    { 
        id: 3, 
        nombre: 'Freund Roosevelt', 
        direccion: 'Freund, Avenida Roosevelt, San Miguel' 
    },
    { 
        id: 4, 
        nombre: 'Freund Centro', 
        direccion: 'Freund, Centro de San Miguel' 
    },
    { 
        id: 5, 
        nombre: 'PartPlus', 
        direccion: 'PartPlus, Carretara Panamericana, Salida San Miguel' 
    },
    { 
        id: 7, 
        nombre: 'Super Repuestos', 
        direccion: 'Super Repuestos, Carretara Panamericana, Salida San Miguel' 
    },
    { 
        id: 8, 
        nombre: 'Super Repuestos', 
        direccion: 'Super Repuestos, Carretera Panamericana, San Miguel' 
    },
    { 
        id: 11, 
        nombre: 'EPA', 
        direccion: 'EPA, Calle Antigua a la Union, San Miguel' 
    },
    { 
        id: 13, 
        nombre: 'Redondel El Triángulo - San Miguel', 
        direccion: 'Triángulo, Carreta Panamericana' 
    },
    { 
        id: 22, 
        nombre: 'Walmart San Miguel', 
        direccion: 'Walmart, Centro Carretera salida a Cuco' 
    }
];

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      const [categoriasResponse, productosResponse] = await Promise.all([
        clienteService.getCategoriasActivas(),
        clienteService.getProductosPorCategoria('')
      ]);

      const categoriasData = categoriasResponse.data.data || categoriasResponse.data;
      const productosData = productosResponse.data.data || productosResponse.data;

      setCategorias(categoriasData);
      setProductos(productosData.filter(p => p.disponible));

    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // ✅ FUNCIÓN PARA REALIZAR PEDIDO (RECIBE EL CARRITO COMO PARÁMETRO)
  const realizarPedido = async (datosCliente, carritoParaEnviar) => {
    try {
      // ✅ VALIDAR QUE EL USUARIO ESTÉ AUTENTICADO
      if (!user || !user.id) {
        throw new Error('Debes iniciar sesión para realizar un pedido');
      }

      console.log('═══════════════════════════════════');
      console.log('🚀 INICIANDO PEDIDO');
      console.log('═══════════════════════════════════');
      console.log('👤 Usuario autenticado:', user);
      console.log('🆔 ID del usuario:', user.id);
      console.log('📧 Email:', user.email);
      console.log('👔 Rol:', user.rol);
      console.log('🛒 Carrito recibido:', carritoParaEnviar);
      console.log('═══════════════════════════════════');

      // ✅ VALIDAR QUE HAY PRODUCTOS EN EL CARRITO
      if (!carritoParaEnviar || carritoParaEnviar.length === 0) {
        throw new Error('El carrito está vacío');
      }

      // ✅ CALCULAR TOTAL DEL CARRITO
      const total = carritoParaEnviar.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
      console.log('  Total calculado:', total);

      // ✅ CONSTRUIR DATOS DEL PEDIDO CON EL ID DEL USUARIO AUTENTICADO
      const pedidoData = {
        usuario_id: user.id,
        numero_mesa: datosCliente.mesa || 'Delivery',
        ubicacion: datosCliente.ubicacion || null,
        notas: datosCliente.notas || '',
        items: carritoParaEnviar.map(item => ({
          id: item.id,
          cantidad: item.cantidad,
          precio: parseFloat(item.precio),
          notas: item.notas || ''
        }))
      };

      console.log('📦 Datos del pedido a enviar:');
      console.log(JSON.stringify(pedidoData, null, 2));

      // ✅ ENVIAR PEDIDO AL BACKEND
      const pedidoResponse = await clienteService.crearPedidoCompleto(pedidoData);
      const pedido = pedidoResponse.data.data || pedidoResponse.data;

      console.log('═══════════════════════════════════');
      console.log('✅ PEDIDO CREADO EXITOSAMENTE');
      console.log('═══════════════════════════════════');
      console.log('📋 Respuesta del servidor:', pedido);
      console.log('🔢 Número de pedido:', pedido.numero_pedido);
      console.log('  Total del pedido:', pedido.total);
      console.log('🆔 Usuario ID en el pedido:', pedido.usuario_id);
      console.log('═══════════════════════════════════');

      // ✅ VERIFICAR QUE EL USUARIO_ID SEA CORRECTO
      if (pedido.usuario_id !== user.id) {
        console.error('⚠️ ADVERTENCIA: El usuario_id del pedido NO coincide!');
        console.error('   - Esperado:', user.id);
        console.error('   - Recibido:', pedido.usuario_id);
      }

      return { 
        success: true, 
        pedido,
        mensaje: 'Pedido realizado exitosamente'
      };

    } catch (err) {
      console.error('═══════════════════════════════════');
      console.error('❌ ERROR AL REALIZAR PEDIDO');
      console.error('═══════════════════════════════════');
      console.error('Error completo:', err);
      console.error('Response:', err.response);
      console.error('Message:', err.message);
      console.error('═══════════════════════════════════');
      
      throw new Error(err.response?.data?.message || err.message || 'Error al realizar el pedido');
    }
  };

  const productosFiltrados = categoriaActiva === 'todos' 
    ? productos 
    : productos.filter(p => p.categoria_id === categoriaActiva);

  const categoriasPrincipales = [
    { id: 'todos', nombre: 'Todos los productos' },
    ...categorias.filter(cat => 
      ['Platos Fuertes', 'Entradas', 'Postres', 'Bebidas'].includes(cat.nombre)
    )
  ];

  return {
    categorias: categoriasPrincipales,
    productos: productosFiltrados,
    loading,
    error,
    categoriaActiva,
    setCategoriaActiva,
    realizarPedido,
    refetch: cargarDatos,
    user,
    puntosEntrega // ✅ EXPORTAR PUNTOS DE ENTREGA
  };
};