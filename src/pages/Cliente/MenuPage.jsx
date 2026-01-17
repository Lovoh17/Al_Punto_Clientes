import React, { useState, useEffect } from 'react';
import { useCliente } from '../../Hooks/useCliente';
import Carrito from '../../components/Cliente/Carrito';
import Loading from '../../components/Common/Loading';
import Error from '../../components/Common/Error';

const colors = {
  primary: '#df3a28ff',
  primaryLight: '#333333',
  secondary: '#E74C3C',
  accent: '#FF6B5B',
  background: '#FFFFFF',
  cardBg: '#FFFFFF',
  text: {
    primary: '#000000',
    secondary: '#333333',
    light: '#666666'
  },
  border: '#E0E0E0',
  success: '#689F38',
  warning: '#E74C3C',
  gray: {
    50: '#F9F9F9',
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

const MenuPage = () => {
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarritoMovil, setMostrarCarritoMovil] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const {
    categorias,
    productos,
    loading,
    error,
    categoriaActiva,
    setCategoriaActiva,
    realizarPedido,
    puntosEntrega
  } = useCliente();

  const productosFiltrados = categoriaActiva === 'todos' 
    ? productos 
    : productos.filter(producto => producto.categoria_id === categoriaActiva);

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existente = prev.find(item => item.id === producto.id);
      if (existente) {
        return prev.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const removerDelCarrito = (productoId) => {
    setCarrito(prev => prev.filter(item => item.id !== productoId));
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      removerDelCarrito(productoId);
      return;
    }
    setCarrito(prev =>
      prev.map(item =>
        item.id === productoId
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  const totalCarrito = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: colors.background
    }}>
      {/* Header Principal */}
      <header style={{
        background: colors.cardBg,
        borderBottom: `1px solid ${colors.border}`,
        padding: isMobile ? '16px' : '20px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Logo y Carrito */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isMobile ? '16px' : '10px'
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '8px' : '12px'
          }}>
            <img 
              src=""
              alt=""
              style={{
                height: isMobile ? '40px' : '48px',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                const size = isMobile ? '0px' : '0px';
                const fontSize = isMobile ? '16px' : '20px';
                e.target.parentElement.innerHTML = `
                  <div style="width: ${size}; height: ${size}; background: ${colors.primary}; display: flex; align-items: center; justify-content: center; color: white; font-size: ${fontSize}; font-weight: 700;">
                    R
                  </div>
                `;
              }}
            />
            <div>
              <div style={{
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: '700',
                color: colors.text.primary
              }}>
                
              </div>
              {!isMobile && (
                <div style={{
                  fontSize: '12px',
                  color: colors.text.light
                }}>
                  
                </div>
              )}
            </div>
          </div>

          {/* Botón Carrito */}
          <button
            onClick={() => setMostrarCarritoMovil(!mostrarCarritoMovil)}
            style={{
              background: colors.secondary,
              border: 'none',
              padding: isMobile ? '10px 16px' : '10px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              position: 'relative',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: isMobile ? '14px' : '16px'
            }}
          >
            <span>{isMobile ? '🛒' : 'Carrito'}</span>
            {carrito.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: colors.accent,
                color: '#ffffff',
                minWidth: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: '700',
                padding: '0 6px',
                borderRadius: '11px'
              }}>
                {carrito.length}
              </div>
            )}
          </button>
        </div>

        {/* Chips de Categorías */}
        <div style={{
          display: 'flex',
          gap: isMobile ? '8px' : '12px',
          overflowX: 'auto',
          paddingBottom: '8px',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch'
        }}>
          <button
            onClick={() => setCategoriaActiva('todos')}
            style={{
              padding: isMobile ? '8px 16px' : '10px 20px',
              background: categoriaActiva === 'todos' ? colors.primary : colors.gray[100],
              color: categoriaActiva === 'todos' ? '#ffffff' : colors.text.primary,
              border: categoriaActiva === 'todos' ? `1px solid ${colors.primary}` : `1px solid ${colors.border}`,
              fontSize: isMobile ? '13px' : '14px',
              fontWeight: categoriaActiva === 'todos' ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>Todos</span>
            <span style={{
              background: categoriaActiva === 'todos' ? 'rgba(255,255,255,0.2)' : colors.gray[200],
              padding: '2px 8px',
              fontSize: isMobile ? '11px' : '12px',
              fontWeight: '600'
            }}>
              {productos.length}
            </span>
          </button>

          {categorias.filter(c => c.id !== 'todos').map(categoria => (
            <button
              key={categoria.id}
              onClick={() => setCategoriaActiva(categoria.id)}
              style={{
                padding: isMobile ? '8px 16px' : '10px 20px',
                background: categoriaActiva === categoria.id ? colors.primary : colors.gray[100],
                color: categoriaActiva === categoria.id ? '#ffffff' : colors.text.primary,
                border: categoriaActiva === categoria.id ? `1px solid ${colors.primary}` : `1px solid ${colors.border}`,
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: categoriaActiva === categoria.id ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {categoria.nombre}
            </button>
          ))}
        </div>
      </header>

      {/* Contenido Principal */}
      <main style={{
        padding: isMobile ? '20px 16px' : '10px 32px',
        maxWidth: '1400px',
        margin: '0 auto',
        paddingBottom: carrito.length > 0 && isMobile ? '100px' : isMobile ? '20px' : '40px'
      }}>
        {/* Título de Categoría */}
        <div style={{
          marginBottom: isMobile ? '20px' : '32px',
          textAlign: isMobile ? 'center' : 'left'
        }}>
          <h1 style={{
            fontSize: isMobile ? '22px' : '28px',
            fontWeight: '700',
            color: colors.text.primary,
            margin: '0 0 8px 0',
            letterSpacing: '-0.5px'
          }}>
            {categorias.find(c => c.id === categoriaActiva)?.nombre || 'Todos los Productos'}
          </h1>
          <p style={{
            fontSize: isMobile ? '13px' : '14px',
            color: colors.text.light,
            margin: 0
          }}>
            {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto disponible' : 'productos disponibles'}
          </p>
        </div>

        {/* Grid de Productos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: isMobile ? '20px' : '32px'
        }}>
          {productosFiltrados.map(producto => (
            <div key={producto.id} style={{
              background: colors.cardBg,
              overflow: 'hidden',
              border: `1px solid ${colors.border}`,
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = colors.secondary;
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.borderColor = colors.border;
              }
            }}>
              {/* Imagen */}
              <div style={{
                height: isMobile ? '180px' : '200px',
                background: `url(${
                  producto.nombre.toLowerCase().includes('carne asada') 
                    ? 'https://firebasestorage.googleapis.com/v0/b/sistema-comandas-f9b26.firebasestorage.app/o/Carne-Asada-Beef-PNG-Image.png?alt=media&token=868bfac3-7823-4fd9-83d6-500739852cf2'
                    : producto.nombre.toLowerCase().includes('pollo asado')
                    ? 'https://firebasestorage.googleapis.com/v0/b/sistema-comandas-f9b26.firebasestorage.app/o/2172.jpg?alt=media&token=d63713c7-6776-408b-8f55-e90f83b6d79d'
                    : producto.imagen || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'
                }) center/cover`,
                position: 'relative'
              }}>
                {producto.precio && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: colors.secondary,
                    color: '#ffffff',
                    padding: isMobile ? '6px 12px' : '8px 16px',
                    fontSize: isMobile ? '14px' : '16px',
                    fontWeight: '700'
                  }}>
                    ${producto.precio}
                  </div>
                )}
              </div>
              
              {/* Info */}
              <div style={{ padding: isMobile ? '16px' : '24px' }}>
                <h3 style={{
                  fontSize: isMobile ? '18px' : '20px',
                  fontWeight: '700',
                  color: colors.text.primary,
                  margin: '0 0 8px 0',
                  lineHeight: '1.4'
                }}>
                  {producto.nombre}
                </h3>
                
                <p style={{
                  fontSize: isMobile ? '13px' : '14px',
                  color: colors.text.secondary,
                  margin: '0 0 16px 0',
                  lineHeight: '1.6',
                  height: isMobile ? 'auto' : '42px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: '2',
                  WebkitBoxOrient: 'vertical'
                }}>
                  {producto.descripcion || 'Delicioso platillo preparado con los mejores ingredientes.'}
                </p>
                
                <button
                  onClick={() => agregarAlCarrito(producto)}
                  style={{
                    width: '100%',
                    background: colors.secondary,
                    color: '#ffffff',
                    border: 'none',
                    padding: isMobile ? '12px' : '14px',
                    fontSize: isMobile ? '14px' : '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.background = colors.accent;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.background = colors.secondary;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <span>Añadir al carrito</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {productosFiltrados.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: isMobile ? '60px 20px' : '80px 20px',
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{
              fontSize: isMobile ? '40px' : '48px',
              marginBottom: '24px',
              color: colors.gray[300]
            }}>
              🍽️
            </div>
            <h3 style={{ 
              color: colors.text.primary, 
              margin: '0 0 12px 0',
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: '700'
            }}>
              No hay productos disponibles
            </h3>
            <p style={{ 
              color: colors.text.light, 
              margin: 0,
              fontSize: isMobile ? '14px' : '16px',
              lineHeight: '1.6'
            }}>
              {categoriaActiva === 'todos' 
                ? 'Próximamente tendremos nuevos platillos en nuestro menú.' 
                : 'Próximamente agregaremos productos en esta categoría.'
              }
            </p>
          </div>
        )}
      </main>

      {/* Botón flotante carrito móvil */}
      {carrito.length > 0 && isMobile && (
        <div style={{
          position: 'fixed',
          bottom: '16px',
          left: '16px',
          right: '16px',
          zIndex: 1000
        }}>
          <button
            onClick={() => setMostrarCarritoMovil(!mostrarCarritoMovil)}
            style={{
              width: '100%',
              background: colors.secondary,
              color: '#ffffff',
              border: 'none',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '6px 12px',
                fontSize: '14px',
                fontWeight: '700'
              }}>
                {carrito.length} {carrito.length === 1 ? 'ítem' : 'ítems'}
              </div>
              <span>Ver Carrito</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700' }}>
              ${totalCarrito.toFixed(2)}
            </div>
          </button>
        </div>
      )}

      {/* Modal Carrito */}
      {mostrarCarritoMovil && (
        <div 
          onClick={() => setMostrarCarritoMovil(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1001,
            display: 'flex',
            alignItems: isMobile ? 'flex-end' : 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: colors.cardBg,
              width: isMobile ? '100%' : '500px',
              maxHeight: isMobile ? '85vh' : '90vh',
              overflowY: 'auto',
              padding: isMobile ? '20px 16px' : '24px'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: `2px solid ${colors.border}`
            }}>
              <h3 style={{
                fontSize: isMobile ? '20px' : '22px',
                fontWeight: '700',
                color: colors.text.primary,
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span>Tu Carrito</span>
                {carrito.length > 0 && (
                  <span style={{
                    background: colors.secondary,
                    color: '#ffffff',
                    fontSize: '14px',
                    padding: '4px 12px'
                  }}>
                    {carrito.length}
                  </span>
                )}
              </h3>
              <button
                onClick={() => setMostrarCarritoMovil(false)}
                style={{
                  background: colors.gray[100],
                  border: 'none',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: colors.text.secondary
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <Carrito
                carrito={carrito}
                onActualizarCantidad={actualizarCantidad}
                onRemover={removerDelCarrito}
                onLimpiar={limpiarCarrito}
                total={totalCarrito}
                realizarPedido={realizarPedido}
                puntosEntrega={puntosEntrega}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;