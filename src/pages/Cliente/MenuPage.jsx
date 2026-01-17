import React, { useState, useEffect } from 'react';
import { useCliente } from '../../Hooks/useCliente';
import Carrito from '../../components/Cliente/Carrito';
import Loading from '../../components/Common/Loading';
import Error from '../../components/Common/Error';

const colors = {
  primary: '#000000',
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
  const [showSidebar, setShowSidebar] = useState(false);

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

  // Filtrar productos por categoría activa
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

  // Detectar cambios en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: colors.background,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header para móvil */}
      {isMobile && (
        <header style={{
          background: colors.cardBg,
          borderBottom: `1px solid ${colors.border}`,
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}>
          {/* Botón menú hamburguesa */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            style={{
              background: 'none',
              border: `1px solid ${colors.border}`,
              borderRadius: '0',
              padding: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '44px',
              minHeight: '44px'
            }}
          >
            <div style={{
              width: '20px',
              height: '2px',
              background: colors.text.primary,
              position: 'relative',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                position: 'absolute',
                top: '-6px',
                left: 0,
                width: '100%',
                height: '2px',
                background: colors.text.primary,
                transition: 'all 0.3s ease'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-6px',
                left: 0,
                width: '100%',
                height: '2px',
                background: colors.text.primary,
                transition: 'all 0.3s ease'
              }} />
            </div>
          </button>

          {/* Logo móvil */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flex: 1
          }}>
            <img 
              src="/src/assets/Images/Logos/logo_Blanco.jpg"
              alt="Logo Restaurante"
              style={{
                width: '40px',
                height: '40px',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div style="width: 40px; height: 40px; background: ${colors.primary}; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; font-weight: 700;">
                    R
                  </div>
                `;
              }}
            />
          </div>

          {/* Botón carrito móvil */}
          <button
            onClick={() => setMostrarCarritoMovil(!mostrarCarritoMovil)}
            style={{
              background: colors.secondary,
              border: 'none',
              borderRadius: '0',
              padding: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '44px',
              minHeight: '44px',
              position: 'relative'
            }}
          >
            <div style={{ 
              fontSize: '16px',
              fontWeight: '700',
              color: '#ffffff'
            }}>
              🛒
            </div>
            {carrito.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: colors.accent,
                color: '#ffffff',
                borderRadius: '0',
                minWidth: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: '700',
                padding: '0 4px'
              }}>
                {carrito.length}
              </div>
            )}
          </button>
        </header>
      )}

      <div style={{ 
        display: 'flex', 
        flex: 1,
        position: 'relative'
      }}>
        {/* Sidebar de Categorías */}
        <aside style={{
          width: isMobile ? '280px' : '280px',
          background: colors.cardBg,
          borderRight: isMobile && !showSidebar ? 'none' : `1px solid ${colors.border}`,
          padding: isMobile ? '16px' : '32px 16px',
          position: isMobile ? 'fixed' : 'fixed',
          height: isMobile ? '100vh' : '100vh',
          overflowY: 'auto',
          zIndex: 1001,
          left: isMobile && !showSidebar ? '-280px' : '0',
          top: isMobile ? '0' : '0',
          transition: 'left 0.3s ease',
          display: isMobile ? 'block' : 'block'
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isMobile ? '8px' : '12px',
            marginBottom: isMobile ? '24px' : '40px',
            padding: '0 8px'
          }}>
            <img 
              src="/src/assets/Images/Logos/logo_Blanco.jpg"
              alt="Logo Restaurante"
              style={{
                width: isMobile ? '48px' : '64px',
                height: isMobile ? '48px' : '64px',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div style="width: ${isMobile ? '48px' : '64px'}; height: ${isMobile ? '48px' : '64px'}; background: ${colors.primary}; display: flex; align-items: center; justify-content: center; color: white; font-size: ${isMobile ? '20px' : '24px'}; font-weight: 700;">
                    R
                  </div>
                  <div>
                    <div style="font-size: ${isMobile ? '16px' : '18px'}; font-weight: 700; color: ${colors.text.primary}">
                      Restaurante
                    </div>
                    <div style="font-size: ${isMobile ? '12px' : '14px'}; color: ${colors.text.light}">
                      Sabor Auténtico
                    </div>
                  </div>
                `;
              }}
            />
          </div>

          {/* Categorías desde la API */}
          <div style={{ marginBottom: isMobile ? '24px' : '32px' }}>
            <div style={{
              fontSize: isMobile ? '12px' : '13px',
              fontWeight: '600',
              color: colors.text.light,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '16px',
              padding: '0 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '4px',
                height: '16px',
                background: colors.secondary
              }} />
              <span>NUESTRO MENÚ</span>
            </div>
            
            {/* Lista de categorías */}
            <div style={{ padding: '0 4px' }}>
              <button
                onClick={() => {
                  setCategoriaActiva('todos');
                  if (isMobile) setShowSidebar(false);
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: isMobile ? '12px 16px' : '16px 20px',
                  background: categoriaActiva === 'todos' ? colors.gray[100] : 'transparent',
                  border: 'none',
                  borderRadius: '0',
                  cursor: 'pointer',
                  fontSize: isMobile ? '14px' : '15px',
                  fontWeight: categoriaActiva === 'todos' ? '600' : '500',
                  color: categoriaActiva === 'todos' ? colors.text.primary : colors.text.secondary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.background = colors.gray[50];
                    e.currentTarget.style.color = colors.text.primary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.background = categoriaActiva === 'todos' ? colors.gray[100] : 'transparent';
                    e.currentTarget.style.color = categoriaActiva === 'todos' ? colors.text.primary : colors.text.secondary;
                  }
                }}
              >
                <span>Todos los produtos</span>
                <div style={{
                  background: categoriaActiva === 'todos' ? colors.secondary : colors.gray[200],
                  color: categoriaActiva === 'todos' ? '#ffffff' : colors.text.light,
                  fontSize: isMobile ? '11px' : '12px',
                  padding: isMobile ? '2px 8px' : '4px 10px',
                  borderRadius: '0',
                  fontWeight: '600'
                }}>
                  {productos.length}
                </div>
              </button>

              
            </div>
          </div>

          {/* Versión */}
          <div style={{
            marginTop: 'auto',
            padding: isMobile ? '16px 8px 0 8px' : '24px 12px 0 12px',
            fontSize: isMobile ? '10px' : '11px',
            color: colors.text.light,
            textAlign: 'center',
            borderTop: `1px solid ${colors.border}`
          }}>
            <div>El Arte de Cocinar con Precision y Sabor - 2025</div>
          </div>
        </aside>

        {/* Overlay para móvil cuando sidebar está abierto */}
        {isMobile && showSidebar && (
          <div 
            onClick={() => setShowSidebar(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000
            }}
          />
        )}

        {/* Contenido Principal */}
        <main style={{
          marginLeft: isMobile ? '0' : '280px',
          flex: 1,
          width: '100%',
          paddingBottom: carrito.length > 0 && isMobile ? '100px' : '0'
        }}>
          {/* Header Superior - Solo en desktop */}
          {!isMobile && (
            <header style={{
              background: colors.cardBg,
              borderBottom: `1px solid ${colors.border}`,
              padding: '20px 32px',
              position: 'sticky',
              top: 0,
              zIndex: 100,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px'
            }}>
              {/* Título de la categoría actual */}
              <div>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: colors.text.primary,
                  margin: '0 0 4px 180px',
                  letterSpacing: '-0.5px'
                }}>
                  {'Platos Principales'}
                </h1>
                <p style={{
                  fontSize: '14px',
                  color: colors.text.light,
                  margin: 0
                }}>
                  {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto disponible' : 'productos disponibles'}
                </p>
              </div>
            
              {/* Búsqueda y Carrito */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <button
                  onClick={() => setMostrarCarritoMovil(!mostrarCarritoMovil)}
                  style={{
                    background: colors.cardBg,
                    borderRadius: '0',
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.secondary;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = carrito.length > 0 ? colors.secondary : colors.border;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 20px',
                    background: colors.secondary,
                    borderRadius: '5px',
                  }}>
                    <div style={{ 
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#ffffff',
                      letterSpacing: '0.5px'
                    }}>
                      Carrito
                    </div>
                  </div>
                  {carrito.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: colors.secondary,
                      color: '#ffffff',
                      borderRadius: '0',
                      minWidth: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '700',
                      padding: '0 6px'
                    }}>
                      {carrito.length}
                    </div>
                  )}
                </button>
              </div>
            </header>
          )}

          {/* Header móvil para categoría actual */}
          {isMobile && (
            <div style={{
              background: colors.cardBg,
              borderBottom: `1px solid ${colors.border}`,
              padding: '16px',
              marginTop: isMobile ? '0' : '0'
            }}>
              <h1 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: colors.text.primary,
                margin: '0 0 4px 0',
                textAlign: 'center'
              }}>
                {categorias.find(c => c.id === categoriaActiva)?.nombre || 'Platos Principales'}
              </h1>
              <p style={{
                fontSize: '14px',
                color: colors.text.light,
                margin: 0,
                textAlign: 'center'
              }}>
                {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto disponible' : 'productos disponibles'}
              </p>
            </div>
          )}

          {/* Contenido de Productos */}
          <div style={{ 
            padding: isMobile ? '20px 16px' : '40px 32px',
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%'
          }}>
            {/* Grid de Productos */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: isMobile ? '20px' : '32px'
            }}>
              {productosFiltrados.map(producto => (
                <div key={producto.id} style={{
                  background: colors.cardBg,
                  borderRadius: '0',
                  overflow: 'hidden',
                  border: `1px solid ${colors.border}`,
                  transition: isMobile ? 'none' : 'all 0.3s ease',
                  boxShadow: isMobile ? '0 1px 3px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0.05)'
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
                  {/* Imagen del Producto */}
                  <div style={{
                    height: isMobile ? '160px' : '200px',
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
                        top: isMobile ? '12px' : '16px',
                        right: isMobile ? '12px' : '16px',
                        background: colors.secondary,
                        color: '#ffffff',
                        padding: isMobile ? '6px 12px' : '8px 16px',
                        borderRadius: '0',
                        fontSize: isMobile ? '14px' : '16px',
                        fontWeight: '700'
                      }}>
                        ${producto.precio}
                      </div>
                    )}
                  </div>
                  
                  {/* Información del Producto */}
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
                      display: isMobile ? 'block' : '-webkit-box',
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
                        borderRadius: '0',
                        padding: isMobile ? '12px' : '14px',
                        fontSize: isMobile ? '14px' : '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: isMobile ? 'none' : 'all 0.3s ease',
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
                padding: isMobile ? '40px 16px' : '80px 20px',
                background: colors.cardBg,
                borderRadius: '0',
                border: `1px solid ${colors.border}`,
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                <div style={{
                  fontSize: isMobile ? '36px' : '48px',
                  marginBottom: isMobile ? '16px' : '24px',
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
          </div>
        </main>
      </div>

      {/* Botón flotante del carrito en móvil */}
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
              borderRadius: '0',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease',
              minHeight: '60px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '0',
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

      {/* Modal Carrito para móvil */}
      {mostrarCarritoMovil && isMobile && (
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
            alignItems: 'flex-end'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: colors.cardBg,
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              borderTopLeftRadius: '0',
              borderTopRightRadius: '0',
              padding: '20px 16px'
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
                fontSize: '20px',
                fontWeight: '700',
                color: colors.text.primary,
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>Tu Carrito</span>
                {carrito.length > 0 && (
                  <span style={{
                    background: colors.secondary,
                    color: '#ffffff',
                    fontSize: '13px',
                    padding: '3px 10px',
                    borderRadius: '0'
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
                  borderRadius: '0',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: colors.text.secondary
                }}
              >
                ×
              </button>
            </div>
            
            {/* Componente Carrito */}
            <div style={{ 
              maxHeight: 'calc(85vh - 120px)', 
              overflowY: 'auto', 
              paddingRight: '4px',
              marginBottom: '16px'
            }}>
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