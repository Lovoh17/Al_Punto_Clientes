import React, { useState } from 'react';
import { useCliente } from '../../Hooks/useCliente';
import ProductoCard from '../../components/Cliente/ProductoCard';
import Carrito from '../../components/Cliente/Carrito';
import Loading from '../../components/Common/Loading';
import Error from '../../components/Common/Error';

const colors = {
  primary: '#2c5aa0',
  primaryLight: '#3a6bc5',
  success: '#10b981',
  warning: '#f59e0b',
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

const MenuPage = () => {
  // ✅ CARRITO MANEJADO LOCALMENTE EN EL COMPONENTE
  const [carrito, setCarrito] = useState([]);

  // ✅ SOLO OBTENER LO NECESARIO DEL HOOK (SIN CARRITO)
  const {
    categorias,
    productos,
    loading,
    error,
    categoriaActiva,
    setCategoriaActiva,
    realizarPedido,
    puntosEntrega // ✅ Obtener puntos de entrega
  } = useCliente();

  // ✅ FUNCIONES PARA MANEJAR EL CARRITO LOCALMENTE
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

  // ✅ CALCULAR TOTAL DEL CARRITO
  const totalCarrito = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: colors.gray[50]
    }}>
      {/* Header */}
      <header style={{
        background: '#ffffff',
        borderBottom: `2px solid ${colors.gray[200]}`,
        padding: '20px 0',
        marginBottom: '32px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '0 24px' 
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h1 style={{ 
                fontSize: '32px', 
                margin: '0 0 4px 0',
                fontWeight: '800',
                color: colors.gray[900],
                letterSpacing: '-0.5px'
              }}>
                Menú Digital
              </h1>
              <p style={{ 
                fontSize: '14px', 
                margin: 0,
                color: colors.gray[600],
                fontWeight: '500'
              }}>
                Realiza tu pedido de forma rápida y sencilla
              </p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              background: colors.gray[50],
              padding: '12px 20px',
              border: `2px solid ${colors.gray[200]}`
            }}>
              <div style={{
                background: colors.primary,
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '16px'
              }}>
                {carrito.length}
              </div>
              <div>
                <div style={{
                  fontSize: '11px',
                  color: colors.gray[600],
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '2px'
                }}>
                  Total
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  color: colors.gray[900]
                }}>
                  ${totalCarrito.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '0 24px' 
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 420px',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Contenido principal */}
          <div>
            {/* Navegación de categorías */}
            <div style={{ 
              marginBottom: '32px',
              background: '#ffffff',
              padding: '16px',
              border: `2px solid ${colors.gray[200]}`
            }}>
              <div style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '4px'
              }}>
                {categorias.map(categoria => (
                  <button
                    key={categoria.id}
                    onClick={() => setCategoriaActiva(categoria.id)}
                    style={{
                      background: categoriaActiva === categoria.id ? colors.primary : '#ffffff',
                      color: categoriaActiva === categoria.id ? '#ffffff' : colors.gray[700],
                      border: `2px solid ${categoriaActiva === categoria.id ? colors.primary : colors.gray[300]}`,
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: categoriaActiva === categoria.id ? '700' : '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                      letterSpacing: '0.3px'
                    }}
                    onMouseEnter={(e) => {
                      if (categoriaActiva !== categoria.id) {
                        e.currentTarget.style.background = colors.gray[100];
                        e.currentTarget.style.borderColor = colors.gray[400];
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (categoriaActiva !== categoria.id) {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.borderColor = colors.gray[300];
                      }
                    }}
                  >
                    {categoria.nombre}
                  </button>
                ))}
              </div>
            </div>

            {/* Sección de productos */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                padding: '0 4px'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: colors.gray[900],
                  margin: 0
                }}>
                  Productos Disponibles
                </h2>
                <div style={{
                  fontSize: '14px',
                  color: colors.gray[600],
                  fontWeight: '600',
                  background: colors.gray[100],
                  padding: '6px 12px',
                  border: `1px solid ${colors.gray[200]}`
                }}>
                  {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
                </div>
              </div>

              {/* Grid de productos */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px'
              }}>
                {productos.map(producto => (
                  <ProductoCard
                    key={producto.id}
                    producto={producto}
                    onAgregar={agregarAlCarrito}
                  />
                ))}
              </div>

              {productos.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '64px 20px',
                  background: '#ffffff',
                  border: `2px solid ${colors.gray[200]}`,
                  marginTop: '24px'
                }}>
                  <div style={{ 
                    fontSize: '64px', 
                    marginBottom: '20px', 
                    color: colors.gray[300]
                  }}>
                    📋
                  </div>
                  <h3 style={{ 
                    color: colors.gray[800], 
                    margin: '0 0 12px 0',
                    fontSize: '20px',
                    fontWeight: '700'
                  }}>
                    No hay productos disponibles
                  </h3>
                  <p style={{ 
                    color: colors.gray[600], 
                    margin: 0,
                    fontSize: '14px',
                    maxWidth: '400px',
                    lineHeight: '1.6'
                  }}>
                    {categoriaActiva === 'todos' 
                      ? 'Actualmente no hay productos en el menú. Vuelve más tarde.' 
                      : 'No hay productos disponibles en esta categoría.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar del carrito */}
          <aside style={{
            position: 'sticky',
            top: '100px',
            height: 'calc(100vh - 140px)',
            overflowY: 'auto'
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
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: colors.gray[900],
        padding: '40px 0',
        marginTop: '64px',
        borderTop: `4px solid ${colors.primary}`
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '0 24px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            marginBottom: '32px'
          }}>
            <div>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: colors.gray[50],
                marginBottom: '16px'
              }}>
                Sistema de Comandas
              </div>
              <p style={{ 
                fontSize: '14px',
                color: colors.gray[400],
                margin: 0,
                lineHeight: '1.6'
              }}>
                Plataforma digital para pedidos en línea con un sistema eficiente y soporte continuo.
              </p>
            </div>
            
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '700',
                color: colors.gray[300],
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Contacto
              </div>
              <div style={{
                fontSize: '14px',
                color: colors.gray[400],
                lineHeight: '1.8'
              }}>
                <div style={{ marginBottom: '8px' }}>📞 +34 900 123 456</div>
                <div style={{ marginBottom: '8px' }}>✉️ info@comandas.com</div>
                <div>📍 Calle Principal #123</div>
              </div>
            </div>
            
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '700',
                color: colors.gray[300],
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Horario
              </div>
              <div style={{
                fontSize: '14px',
                color: colors.gray[400],
                lineHeight: '1.8'
              }}>
                <div style={{ marginBottom: '8px' }}>Lunes - Viernes: 10:00 - 23:00</div>
                <div style={{ marginBottom: '8px' }}>Sábados: 11:00 - 00:00</div>
                <div>Domingos: 12:00 - 22:00</div>
              </div>
            </div>
          </div>
          
          <div style={{
            borderTop: `1px solid ${colors.gray[800]}`,
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <p style={{ 
              margin: 0,
              fontSize: '13px',
              color: colors.gray[500]
            }}>
              © 2024 Sistema de Comandas. Todos los derechos reservados.
            </p>
            <div style={{
              display: 'flex',
              gap: '24px',
              fontSize: '13px'
            }}>
              <span style={{ 
                color: colors.gray[400],
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = colors.gray[200]}
              onMouseLeave={(e) => e.currentTarget.style.color = colors.gray[400]}
              >
                Términos y Condiciones
              </span>
              <span style={{ color: colors.gray[600] }}>•</span>
              <span style={{ 
                color: colors.gray[400],
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = colors.gray[200]}
              onMouseLeave={(e) => e.currentTarget.style.color = colors.gray[400]}
              >
                Política de Privacidad
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MenuPage;