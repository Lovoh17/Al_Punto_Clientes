import React, { useState } from 'react';
import { useCliente } from '../../Hooks/useCliente';
import Carrito from '../../components/Cliente/Carrito';
import Loading from '../../components/Common/Loading';
import Error from '../../components/Common/Error';

const colors = {
  primary: '#000000', // Negro del logo
  primaryLight: '#333333', // Negro más claro
  secondary: '#E74C3C', // Rojo/naranja del logo
  accent: '#FF6B5B', // Variante más clara del rojo
  background: '#FFFFFF', // Blanco
  cardBg: '#FFFFFF', // Blanco
  text: {
    primary: '#000000', // Negro
    secondary: '#333333', // Gris oscuro
    light: '#666666' // Gris medio
  },
  border: '#E0E0E0', // Gris claro
  success: '#689F38', // Verde
  warning: '#E74C3C', // Rojo
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

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: colors.background,
      display: 'flex'
    }}>
      {/* Sidebar de Categorías */}
      <aside style={{
        width: '280px',
        background: colors.cardBg,
        borderRight: `1px solid ${colors.border}`,
        padding: '32px 16px',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        display: window.innerWidth >= 768 ? 'block' : 'none'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '40px',
          padding: '0 8px'
        }}>
          <img 
            src=""
            alt="Logo Restaurante"
            style={{
              width: '64px',
              height: '64px',
              objectFit: 'contain'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `
                <div style="width: 64px; height: 64px; background: ${colors.primary}; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 700;">
                  R
                </div>
                <div>
                  <div style="font-size: 18px; font-weight: 700; color: ${colors.text.primary}">
                    Restaurante
                  </div>
                  <div style="font-size: 14px; color: ${colors.text.light}">
                    Sabor Auténtico
                  </div>
                </div>
              `;
            }}
          />
        </div>

        {/* Categorías desde la API */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            fontSize: '13px',
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
          
          <div style={{ padding: '0 8px' }}>
            {categorias.map(categoria => {
              const isActive = categoriaActiva === categoria.id;
              const itemCount = productos.filter(p => p.categoria_id === categoria.id).length;
              
              return (
                <button
                  key={categoria.id}
                  onClick={() => setCategoriaActiva(categoria.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '14px 16px',
                    marginBottom: '6px',
                    background: isActive ? colors.primaryLight + '15' : 'transparent',
                    color: isActive ? colors.secondary : colors.text.secondary,
                    border: 'none',
                    borderRadius: '0',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: isActive ? '600' : '500',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = colors.gray[100];
                      e.currentTarget.style.color = colors.secondary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = colors.text.secondary;
                    }
                  }}
                >
                  <span>{categoria.nombre}</span>
                  {itemCount > 0 && (
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: isActive ? colors.secondary : colors.text.light,
                      background: isActive ? colors.secondary + '20' : colors.gray[100],
                      padding: '2px 8px',
                      borderRadius: '0'
                    }}>
                      {itemCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Botón Reservar Mesa */}
        <div style={{ padding: '0 12px' }}>
          <button style={{
            width: '100%',
            background: colors.secondary,
            color: '#ffffff',
            border: 'none',
            borderRadius: '0',
            padding: '16px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '24px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.accent;
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.secondary;
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            Reservar Mesa
          </button>
        </div>

        {/* Información del Restaurante */}
        <div style={{
          marginTop: '32px',
          padding: '20px 16px',
          background: colors.gray[100],
          borderRadius: '0',
          border: `1px solid ${colors.border}`
        }}>
          <div style={{
            fontSize: '13px',
            fontWeight: '600',
            color: colors.text.secondary,
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '16px' }}>⏰</span>
            Horario
          </div>
          <div style={{
            fontSize: '12px',
            color: colors.text.light,
            lineHeight: '1.6'
          }}>
            <div>Lun-Vie: 12:00 - 23:00</div>
            <div>Sáb-Dom: 11:00 - 00:00</div>
          </div>
        </div>

        {/* Versión */}
        <div style={{
          marginTop: 'auto',
          padding: '24px 12px 0 12px',
          fontSize: '11px',
          color: colors.text.light,
          textAlign: 'center',
          borderTop: `1px solid ${colors.border}`
        }}>
          <div>v2.4.0 • Sistema de Comandas</div>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main style={{
        marginLeft: window.innerWidth >= 768 ? '280px' : '0',
        flex: 1,
        paddingBottom: carrito.length > 0 && window.innerWidth < 768 ? '100px' : '0'
      }}>
        {/* Header Superior */}
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
              margin: '0 0 4px 0',
              letterSpacing: '-0.5px'
            }}>
              {categorias.find(c => c.id === categoriaActiva)?.nombre || 'Platos Principales'}
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
            <div style={{
              position: 'relative',
              minWidth: '240px'
            }}>
              <input
                type="text"
                placeholder="Buscar plato..."
                style={{
                  width: '100%',
                  background: colors.gray[100],
                  border: `1px solid ${colors.border}`,
                  borderRadius: '0',
                  padding: '12px 16px 12px 44px',
                  fontSize: '14px',
                  color: colors.text.secondary,
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.secondary;
                  e.target.style.boxShadow = `0 0 0 3px ${colors.secondary}15`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: colors.text.light,
                fontSize: '16px'
              }}>
                🔍
              </div>
            </div>

            <button
              onClick={() => setMostrarCarritoMovil(!mostrarCarritoMovil)}
              style={{
                background: colors.cardBg,
                border: `2px solid ${carrito.length > 0 ? colors.secondary : colors.border}`,
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
                fontSize: '20px',
                color: colors.secondary
              }}>
                🛒
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

        {/* Contenido de Productos */}
        <div style={{ padding: '40px 32px' }}>
          {/* Grid de Productos */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '32px'
          }}>
            {productosFiltrados.map(producto => (
              <div key={producto.id} style={{
                background: colors.cardBg,
                borderRadius: '0',
                overflow: 'hidden',
                border: `1px solid ${colors.border}`,
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = colors.secondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.borderColor = colors.border;
              }}>
                {/* Imagen del Producto */}
                <div style={{
                  height: '200px',
                  background: `url(${producto.imagen || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'}) center/cover`,
                  position: 'relative'
                }}>
                  {producto.precio && (
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: colors.secondary,
                      color: '#ffffff',
                      padding: '8px 16px',
                      borderRadius: '0',
                      fontSize: '16px',
                      fontWeight: '700'
                    }}>
                    </div>
                  )}
                </div>
                
                {/* Información del Producto */}
                <div style={{ padding: '24px' }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: colors.text.primary,
                    margin: '0 0 12px 0',
                    lineHeight: '1.4'
                  }}>
                    {producto.nombre}
                  </h3>
                  
                  <p style={{
                    fontSize: '14px',
                    color: colors.text.secondary,
                    margin: '0 0 20px 0',
                    lineHeight: '1.6',
                    height: '42px',
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
                      borderRadius: '0',
                      padding: '14px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.accent;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = colors.secondary;
                      e.currentTarget.style.transform = 'translateY(0)';
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
              padding: '80px 20px',
              background: colors.cardBg,
              borderRadius: '0',
              border: `1px solid ${colors.border}`,
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '24px',
                color: colors.gray[300]
              }}>
                🍽️
              </div>
              <h3 style={{ 
                color: colors.text.primary, 
                margin: '0 0 12px 0',
                fontSize: '24px',
                fontWeight: '700'
              }}>
                No hay productos disponibles
              </h3>
              <p style={{ 
                color: colors.text.light, 
                margin: 0,
                fontSize: '16px',
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

      {/* Botón flotante del carrito en móvil */}
      {carrito.length > 0 && window.innerWidth < 768 && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
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
              padding: '20px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.accent;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.secondary;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '0',
                padding: '8px 14px',
                fontSize: '15px',
                fontWeight: '700'
              }}>
                {carrito.length} {carrito.length === 1 ? 'ítem' : 'ítems'}
              </div>
              <span>Ver Carrito</span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700' }}>
              ${totalCarrito.toFixed(2)}
            </div>
          </button>
        </div>
      )}

      {/* Modal Carrito para móvil */}
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
              padding: '24px'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: `2px solid ${colors.border}`
            }}>
              <h3 style={{
                fontSize: '22px',
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
                    padding: '4px 12px',
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
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: colors.text.secondary,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.secondary;
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.gray[100];
                  e.currentTarget.style.color = colors.text.secondary;
                }}
              >
                ×
              </button>
            </div>
            
            {/* Componente Carrito */}
            <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px' }}>
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