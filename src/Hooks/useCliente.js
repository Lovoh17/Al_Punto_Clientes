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
  // En src/Hooks/useCliente.js - MODIFICA la función realizarPedido

const realizarPedido = async (datosCliente, carritoParaEnviar) => {
  try {
    // ... validaciones previas ...

    // ✅ CALCULAR TOTAL
    const total = carritoParaEnviar.reduce((sum, item) => 
      sum + (parseFloat(item.precio) * parseInt(item.cantidad)), 0);
    
    // ✅ GENERAR NÚMERO DE PEDIDO ÚNICO: PED-(nombre_usuario)-(random)
    const generarNumeroPedidoUnico = () => {
      // Obtener las primeras 3 letras del nombre (o email si no hay nombre)
      let nombreBase = '';
      if (user.nombre) {
        // Tomar las primeras 3 letras del nombre, en mayúsculas, sin espacios
        nombreBase = user.nombre
          .replace(/\s+/g, '') // Eliminar espacios
          .substring(0, 3)
          .toUpperCase();
      } else if (user.email) {
        // Tomar las primeras 3 letras antes del @ del email
        nombreBase = user.email
          .split('@')[0]
          .substring(0, 3)
          .toUpperCase();
      } else {
        // Fallback: usar "USR"
        nombreBase = 'USR';
      }
      
      // Generar 2 números aleatorios entre 10 y 99
      const random1 = Math.floor(Math.random() * 90) + 10; // 10-99
      const random2 = Math.floor(Math.random() * 90) + 10; // 10-99
      
      // Formato: PED-JOH-45-78
      const numeroPedido = `PED-${nombreBase}-${random1}-${random2}`;
      
      console.log('🔢 Número único generado:', numeroPedido);
      console.log('   • Nombre base:', nombreBase);
      console.log('   • Random 1:', random1);
      console.log('   • Random 2:', random2);
      
      return numeroPedido;
    };

    const numeroPedido = generarNumeroPedidoUnico();

    // ✅ ESTRUCTURA CORRECTA PARA LA DB
    const pedidoData = {
      usuario_id: user.id,
      numero_pedido: numeroPedido, // ← NÚMERO ÚNICO CON NOMBRE
      numero_mesa: datosCliente.mesa || 'Delivery',
      ubicacion: datosCliente.ubicacion || null,
      total: total,
      estado: 'pendiente',
      notas: datosCliente.notas || '',
      productos: carritoParaEnviar.map(item => ({
        producto_id: item.id,
        cantidad: parseInt(item.cantidad),
        precio_unitario: parseFloat(item.precio),
        notas: item.notas || ''
      }))
    };

    console.log('📦 Datos del pedido completo:');
    console.log(JSON.stringify(pedidoData, null, 2));
    
    // ✅ ENVIAR AL BACKEND
    const response = await clienteService.crearPedidoCompleto(pedidoData);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Error al crear pedido');
    }

    console.log('✅ PEDIDO CREADO EXITOSAMENTE');
    console.log('📋 Respuesta:', response.data.data);
    
    return { 
      success: true, 
      pedido: response.data.data,
      mensaje: 'Pedido realizado exitosamente',
      numero_pedido: numeroPedido // Devolver el número generado
    };

  } catch (err) {
    console.error('❌ ERROR AL REALIZAR PEDIDO:', err);
    
    // Si es error de duplicado, reintentar con nuevo número
    if (err.message.includes('duplicate key') || 
        err.message.includes('duplicate') ||
        err.response?.data?.error?.includes('duplicate')) {
      
      console.log('🔄 ERROR: Número duplicado, reintentando...');
      // En un caso real, aquí podrías llamar recursivamente a realizarPedido
      // con un nuevo intento, pero es mejor prevenir que curar
      
      throw new Error(
        'Error: El número de pedido ya existe. ' +
        'Por favor, intenta nuevamente en un momento.'
      );
    }
    
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
    puntosEntrega,
    // Función para obtener el siguiente número (opcional, para mostrar en UI)
    obtenerSiguienteNumero: () => {
      const siguiente = ultimoNumeroPedido + 1;
      return 'PED-' + String(siguiente).padStart(3, '0');
    }
  };
};