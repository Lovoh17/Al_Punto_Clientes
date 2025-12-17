import React, { useState } from 'react';

const colors = {
  primary: '#ef4444',
  primaryLight: '#fef2f2',
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

const CarritoPage = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      nombre: 'Hamburguesa Clásica',
      descripcion: 'Carne angus, queso cheddar, lechuga fresca y nuestra salsa especial.',
      precio: 12.00,
      cantidad: 1,
      imagen: '/placeholder-burger.jpg'
    },
    {
      id: 2,
      nombre: 'Pizza Margherita',
      descripcion: 'Salsa de tomate San Marzano, mozzarella di bufala y albahaca.',
      precio: 14.00,
      cantidad: 2,
      imagen: '/placeholder-pizza.jpg'
    },
    {
      id: 3,
      nombre: 'Ensalada César',
      descripcion: 'Lechuga romana crujiente, aderezo casero, crutones y parmesano.',
      precio: 9.00,
      cantidad: 1,
      imagen: '/placeholder-salad.jpg'
    }
  ]);

  const [notasEspeciales, setNotasEspeciales] = useState('');
  const [propina, setPropina] = useState(15);
  const [montoPersonalizado, setMontoPersonalizado] = useState('');

  const subtotal = items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  const impuestos = subtotal * 0.10;
  const tarifaServicio = 2.00;
  const descuento = 5.00;
  const propinaCalculada = propina === 'personalizado' 
    ? parseFloat(montoPersonalizado) || 0 
    : (subtotal * propina / 100);
  const total = subtotal + impuestos + tarifaServicio - descuento + propinaCalculada;

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    setItems(items.map(item => 
      item.id === id ? { ...item, cantidad: nuevaCantidad } : item
    ));
  };

  const eliminarItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: colors.gray[50]
    }}>
      {/* Header */}
      <header style={{
        background: '#ffffff',
        borderBottom: `1px solid ${colors.gray[200]}`,
        padding: '16px 24px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: colors.primary,
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '700'
            }}>
              R
            </div>
            <h1 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: colors.gray[900],
              margin: 0
            }}>
              Restaurante Gourmet
            </h1>
          </div>

          <nav style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'center'
          }}>
            <a href="#" style={{
              fontSize: '14px',
              color: colors.gray[600],
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Inicio
            </a>
            <a href="#" style={{
              fontSize: '14px',
              color: colors.gray[600],
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Menú
            </a>
            <a href="#" style={{
              fontSize: '14px',
              color: colors.primary,
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Carrito
            </a>
            <a href="#" style={{
              fontSize: '14px',
              color: colors.gray[600],
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Historial
            </a>
          </nav>

          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            <button style={{
              position: 'relative',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                color: colors.gray[600]
              }}>
                🛒
              </div>
              <div style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                background: colors.primary,
                color: '#ffffff',
                borderRadius: '10px',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: '700'
              }}>
                {items.length}
              </div>
            </button>

            <div style={{
              width: '32px',
              height: '32px',
              background: colors.gray[200],
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <span style={{ fontSize: '16px' }}>👤</span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 24px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Lista de Productos */}
          <div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: colors.gray[900],
              margin: '0 0 8px 0'
            }}>
              Tu Pedido
            </h2>
            <p style={{
              fontSize: '14px',
              color: colors.gray[600],
              margin: '0 0 32px 0'
            }}>
              Revisa tus deliciosas selecciones antes de confirmar.
            </p>

            {/* Items del Carrito */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {items.map(item => (
                <div key={item.id} style={{
                  background: '#ffffff',
                  border: `1px solid ${colors.gray[200]}`,
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  gap: '16px'
                }}>
                  {/* Imagen del producto */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: colors.gray[200],
                    borderRadius: '8px',
                    flexShrink: 0,
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(135deg, ${colors.gray[300]} 0%, ${colors.gray[200]} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px'
                    }}>
                      🍔
                    </div>
                  </div>

                  {/* Detalles del producto */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: colors.gray[900],
                        margin: 0
                      }}>
                        {item.nombre}
                      </h3>
                      <button
                        onClick={() => eliminarItem(item.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: colors.gray[400],
                          cursor: 'pointer',
                          padding: '4px',
                          fontSize: '18px'
                        }}
                      >
                        🗑️
                      </button>
                    </div>

                    <p style={{
                      fontSize: '13px',
                      color: colors.gray[600],
                      margin: '0 0 12px 0',
                      lineHeight: '1.5'
                    }}>
                      {item.descripcion}
                    </p>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        fontSize: '13px',
                        color: colors.gray[500]
                      }}>
                        ${item.precio.toFixed(2)} / unidad
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: `1px solid ${colors.gray[300]}`,
                          borderRadius: '6px',
                          overflow: 'hidden'
                        }}>
                          <button
                            onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                            style={{
                              background: '#ffffff',
                              border: 'none',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              fontSize: '16px',
                              color: colors.gray[600]
                            }}
                          >
                            −
                          </button>
                          <div style={{
                            padding: '6px 16px',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: colors.gray[900],
                            borderLeft: `1px solid ${colors.gray[300]}`,
                            borderRight: `1px solid ${colors.gray[300]}`
                          }}>
                            {item.cantidad}
                          </div>
                          <button
                            onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                            style={{
                              background: colors.primary,
                              border: 'none',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              fontSize: '16px',
                              color: '#ffffff'
                            }}
                          >
                            +
                          </button>
                        </div>

                        <div style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: colors.primary,
                          minWidth: '60px',
                          textAlign: 'right'
                        }}>
                          ${(item.precio * item.cantidad).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Notas Especiales */}
            <div style={{
              marginTop: '24px',
              background: '#ffffff',
              border: `1px solid ${colors.gray[200]}`,
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '18px' }}>📝</span>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: colors.gray[900],
                  margin: 0
                }}>
                  Notas Especiales
                </h3>
              </div>
              <p style={{
                fontSize: '13px',
                color: colors.gray[600],
                margin: '0 0 12px 0'
              }}>
                Añade instrucciones especiales o notas para el chef (ej. alergias, preferencias de cocción).
              </p>
              <textarea
                value={notasEspeciales}
                onChange={(e) => setNotasEspeciales(e.target.value)}
                placeholder="Escribe tus instrucciones aquí..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '12px',
                  border: `1px solid ${colors.gray[300]}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: colors.gray[700],
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Resumen del Pedido */}
          <div style={{
            position: 'sticky',
            top: '24px'
          }}>
            <div style={{
              background: '#ffffff',
              border: `1px solid ${colors.gray[200]}`,
              borderRadius: '12px',
              padding: '24px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: colors.gray[900],
                margin: '0 0 20px 0'
              }}>
                Resumen del Pedido
              </h3>

              {/* Desglose de costos */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '14px'
                }}>
                  <span style={{ color: colors.gray[600] }}>Subtotal</span>
                  <span style={{ color: colors.gray[900], fontWeight: '500' }}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '14px'
                }}>
                  <span style={{ color: colors.gray[600] }}>Impuestos (10%)</span>
                  <span style={{ color: colors.gray[900], fontWeight: '500' }}>
                    ${impuestos.toFixed(2)}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '14px'
                }}>
                  <span style={{ color: colors.gray[600] }}>Tarifa de servicio</span>
                  <span style={{ color: colors.gray[900], fontWeight: '500' }}>
                    ${tarifaServicio.toFixed(2)}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '14px'
                }}>
                  <span style={{ color: colors.primary, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>🏷️</span>
                    Descuento aplicado
                  </span>
                  <span style={{ color: colors.primary, fontWeight: '600' }}>
                    -${descuento.toFixed(2)}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '14px'
                }}>
                  <span style={{ color: colors.gray[600] }}>Propina para el equipo (15%)</span>
                  <span style={{ color: colors.gray[900], fontWeight: '500' }}>
                    ${propinaCalculada.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Selector de Propina */}
              <div style={{
                background: colors.warning + '20',
                border: `1px solid ${colors.warning}`,
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <span style={{ fontSize: '16px' }}>⭐</span>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: colors.gray[900]
                  }}>
                    Propina para el equipo
                  </span>
                  <span style={{
                    fontSize: '11px',
                    background: colors.success,
                    color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontWeight: '600'
                  }}>
                    100% para ellos
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px'
                }}>
                  {[10, 15, 20].map(porcentaje => (
                    <button
                      key={porcentaje}
                      onClick={() => setPropina(porcentaje)}
                      style={{
                        background: propina === porcentaje ? colors.primary : '#ffffff',
                        color: propina === porcentaje ? '#ffffff' : colors.gray[700],
                        border: `2px solid ${propina === porcentaje ? colors.primary : colors.gray[300]}`,
                        borderRadius: '8px',
                        padding: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div>{porcentaje}%</div>
                      <div style={{ fontSize: '11px', opacity: 0.8 }}>
                        ${(subtotal * porcentaje / 100).toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPropina('personalizado')}
                  style={{
                    width: '100%',
                    background: propina === 'personalizado' ? colors.primary : '#ffffff',
                    color: propina === 'personalizado' ? '#ffffff' : colors.gray[700],
                    border: `2px solid ${propina === 'personalizado' ? colors.primary : colors.gray[300]}`,
                    borderRadius: '8px',
                    padding: '8px',
                    marginTop: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                >
                  💰 Monto personalizado
                </button>

                {propina === 'personalizado' && (
                  <input
                    type="number"
                    value={montoPersonalizado}
                    onChange={(e) => setMontoPersonalizado(e.target.value)}
                    placeholder="Ingresa el monto"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: `1px solid ${colors.gray[300]}`,
                      borderRadius: '6px',
                      marginTop: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                )}
              </div>

              {/* Total */}
              <div style={{
                borderTop: `2px solid ${colors.gray[200]}`,
                paddingTop: '16px',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: colors.gray[900]
                  }}>
                    Total a Pagar
                  </span>
                  <span style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: colors.primary
                  }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Botones de acción */}
              <button style={{
                width: '100%',
                background: colors.primary,
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '14px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <span>Realizar Pedido</span>
                <span>→</span>
              </button>

              <button style={{
                width: '100%',
                background: 'transparent',
                color: colors.gray[700],
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '16px'
              }}>
                Seguir Pidiendo
              </button>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '12px',
                color: colors.gray[500]
              }}>
                <span>🔒</span>
                <span>Pagos 100% seguros y encriptados</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CarritoPage;