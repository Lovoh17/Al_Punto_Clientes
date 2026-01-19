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
  const [ultimoNumeroPedido, setUltimoNumeroPedido] = useState(0);

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

  // ✅ FUNCIÓN PARA GENERAR NÚMERO DE PEDIDO SECUENCIAL
  const generarNumeroPedido = () => {
    // Obtener el siguiente número (empezando desde 1 si es la primera vez)
    let siguienteNumero = ultimoNumeroPedido + 1;
    
    // Si no tenemos un número guardado, intentar obtener del backend
    if (siguienteNumero === 1 && localStorage.getItem('ultimo_numero_pedido')) {
      siguienteNumero = parseInt(localStorage.getItem('ultimo_numero_pedido')) + 1;
    }
    
    // Formatear a 3 dígitos: PED-001, PED-002, etc.
    const numeroFormateado = 'PED-' + String(siguienteNumero).padStart(3, '0');
    
    // Actualizar estado
    setUltimoNumeroPedido(siguienteNumero);
    
    return numeroFormateado;
  };

  // ✅ CARGAR ÚLTIMO NÚMERO DEL BACKEND AL INICIAR
  const cargarUltimoNumeroBackend = async () => {
    try {
      const response = await clienteService.obtenerUltimoPedidoNumero();
      if (response.data.success && response.data.data) {
        const ultimoNumero = response.data.data;
        setUltimoNumeroPedido(ultimoNumero);
        localStorage.setItem('ultimo_numero_pedido', ultimoNumero.toString());
        console.log('🔢 Último número del backend:', ultimoNumero);
      }
    } catch (error) {
      console.log('⚠️ No se pudo obtener último número del backend');
    }
  };

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
    
    // Cargar último número al iniciar
    cargarUltimoNumeroBackend();
    
    // Si hay un número guardado en localStorage, usarlo
    const numeroGuardado = localStorage.getItem('ultimo_numero_pedido');
    if (numeroGuardado) {
      setUltimoNumeroPedido(parseInt(numeroGuardado));
    }
  }, []);

  // ✅ FUNCIÓN PARA REALIZAR PEDIDO - VERSIÓN SIMPLE Y DIRECTA
  const realizarPedido = async (datosCliente, carritoParaEnviar) => {
    try {
      // ✅ VALIDAR QUE EL USUARIO ESTÉ AUTENTICADO
      if (!user || !user.id) {
        throw new Error('Debes iniciar sesión para realizar un pedido');
      }

      console.log('🚀 INICIANDO PEDIDO');
      console.log('👤 Usuario:', user.email);
      console.log('🆔 ID:', user.id);

      // ✅ VALIDAR QUE HAY PRODUCTOS EN EL CARRITO
      if (!carritoParaEnviar || carritoParaEnviar.length === 0) {
        throw new Error('El carrito está vacío');
      }

      // ✅ CALCULAR TOTAL
      const total = carritoParaEnviar.reduce((sum, item) => 
        sum + (parseFloat(item.precio) * parseInt(item.cantidad)), 0);
      console.log('💰 Total:', total);

      // ✅ GENERAR NÚMERO DE PEDIDO
      const numeroPedido = generarNumeroPedido();
      console.log('🔢 Número generado:', numeroPedido);

      // ✅ CONSTRUIR DATOS DEL PEDIDO - ESTRUCTURA CORRECTA
      const pedidoData = {
        usuario_id: user.id,
        numero_pedido: numeroPedido, // ← NÚMERO GENERADO EN FRONTEND
        numero_mesa: datosCliente.mesa || 'Delivery',
        ubicacion: datosCliente.ubicacion || null,
        notas: datosCliente.notas || '',
        // ⚠️ IMPORTANTE: El backend espera "productos" no "items"
        productos: carritoParaEnviar.map(item => ({
          producto_id: item.id, // ← El backend espera "producto_id" no "id"
          cantidad: parseInt(item.cantidad),
          precio_unitario: parseFloat(item.precio),
          notas: item.notas || ''
        }))
      };

      console.log('📦 Datos a enviar:');
      console.log(JSON.stringify(pedidoData, null, 2));

      // ✅ ENVIAR DIRECTAMENTE AL BACKEND - SIN FALLBACK LOCAL
      const pedidoResponse = await clienteService.crearPedidoCompleto(pedidoData);
      
      if (!pedidoResponse.data.success) {
        // Si el backend responde con error, lanzar excepción
        throw new Error(pedidoResponse.data.error || 'Error al crear pedido');
      }

      // ✅ ACTUALIZAR ÚLTIMO NÚMERO EN localStorage
      const numeroActual = parseInt(numeroPedido.replace('PED-', ''));
      localStorage.setItem('ultimo_numero_pedido', numeroActual.toString());
      setUltimoNumeroPedido(numeroActual);

      console.log('✅ PEDIDO CREADO EXITOSAMENTE');
      console.log('📋 Respuesta:', pedidoResponse.data.data);

      return { 
        success: true, 
        pedido: pedidoResponse.data.data,
        mensaje: 'Pedido realizado exitosamente'
      };

    } catch (err) {
      console.error('❌ ERROR AL REALIZAR PEDIDO:', err);
      
      // Si el error es específico de la función PostgreSQL
      if (err.message.includes('generar_numero_pedido')) {
        throw new Error(
          'Error del servidor: Problema con la generación de números de pedido. ' +
          'Contacta al administrador.'
        );
      }
      
      // Retornar el error exacto del backend
      throw new Error(err.response?.data?.error || err.message || 'Error al realizar el pedido');
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
    puntosEntrega,
    // Función para obtener el siguiente número (opcional, para mostrar en UI)
    obtenerSiguienteNumero: () => {
      const siguiente = ultimoNumeroPedido + 1;
      return 'PED-' + String(siguiente).padStart(3, '0');
    }
  };
};