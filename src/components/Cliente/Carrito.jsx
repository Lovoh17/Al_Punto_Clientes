// src/components/Cliente/Carrito.jsx
import React, { useState, useEffect } from 'react';
import { useCliente } from '../../Hooks/useCliente';

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
  warning: '#FF9800',
  danger: '#D32F2F',
  info: '#1976D2',
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

// Componente Modal para Pago con Tarjeta
const ModalPagoTarjeta = ({ 
  isOpen, 
  onClose, 
  onPaymentSuccess, 
  monto,
  loading = false 
}) => {
  const [cardData, setCardData] = useState({
    numeroTarjeta: '',
    nombreTitular: '',
    mesExpiracion: '',
    anioExpiracion: '',
    cvv: '',
    recordarTarjeta: false
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulamos éxito de pago
    const pagoSimulado = {
      success: true,
      referencia: `PAGO_${Date.now()}`,
      mensaje: 'Pago procesado exitosamente (simulación)'
    };
    onPaymentSuccess(pagoSimulado);
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value.replace(/\D/g, ''));
    setCardData(prev => ({ ...prev, numeroTarjeta: formatted }));
  };

  // Generar años (hasta 10 años adelante)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => 
    String(i + 1).padStart(2, '0')
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: colors.background,
        maxWidth: '500px',
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        animation: 'slideUp 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{
          background: colors.primary,
          padding: '24px',
          color: 'white',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: 'white',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            ×
          </button>
          
          <div>
            <h3 style={{ 
              margin: 0, 
              fontSize: '22px', 
              fontWeight: '700',
              marginBottom: '8px'
            }}>
              Pago con Tarjeta
            </h3>
            <p style={{ 
              margin: 0, 
              opacity: 0.9, 
              fontSize: '14px'
            }}>
              Complete los datos de su tarjeta
            </p>
          </div>
          
          {/* Monto */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '16px',
            borderRadius: '8px',
            marginTop: '20px'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <span style={{ fontSize: '14px', opacity: 0.9 }}>Monto a pagar:</span>
              <span style={{ fontSize: '24px', fontWeight: '800' }}>
                ${monto.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ padding: '32px 24px' }}>
          {/* Número de tarjeta */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: '600',
              color: colors.gray[700],
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Número de tarjeta
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={cardData.numeroTarjeta}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 48px',
                  border: `2px solid ${colors.gray[300]}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = colors.primary}
                onBlur={(e) => e.target.style.borderColor = colors.gray[300]}
              />
              <div style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: colors.gray[500],
                fontSize: '20px'
              }}>
                💳
              </div>
            </div>
          </div>

          {/* Nombre del titular */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: '600',
              color: colors.gray[700],
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Nombre del titular
            </label>
            <input
              type="text"
              value={cardData.nombreTitular}
              onChange={(e) => setCardData(prev => ({ ...prev, nombreTitular: e.target.value }))}
              placeholder="Como aparece en la tarjeta"
              style={{
                width: '100%',
                padding: '14px',
                border: `2px solid ${colors.gray[300]}`,
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = colors.gray[300]}
            />
          </div>

          {/* Fecha expiración y CVV */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '16px', 
            marginBottom: '20px' 
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: colors.gray[700],
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Fecha expiración
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={cardData.mesExpiracion}
                  onChange={(e) => setCardData(prev => ({ ...prev, mesExpiracion: e.target.value }))}
                  style={{
                    flex: 1,
                    padding: '14px',
                    border: `2px solid ${colors.gray[300]}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    background: colors.background,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = colors.gray[300]}
                >
                  <option value="">Mes</option>
                  {months.map(mes => (
                    <option key={mes} value={mes}>{mes}</option>
                  ))}
                </select>
                <select
                  value={cardData.anioExpiracion}
                  onChange={(e) => setCardData(prev => ({ ...prev, anioExpiracion: e.target.value }))}
                  style={{
                    flex: 1,
                    padding: '14px',
                    border: `2px solid ${colors.gray[300]}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    background: colors.background,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = colors.gray[300]}
                >
                  <option value="">Año</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: colors.gray[700],
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                CVV
              </label>
              <input
                type="text"
                value={cardData.cvv}
                onChange={(e) => setCardData(prev => ({ 
                  ...prev, 
                  cvv: e.target.value.replace(/\D/g, '').slice(0, 4) 
                }))}
                placeholder="123"
                style={{
                  width: '100%',
                  padding: '14px',
                  border: `2px solid ${colors.gray[300]}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = colors.primary}
                onBlur={(e) => e.target.style.borderColor = colors.gray[300]}
              />
            </div>
          </div>

          {/* Checkbox recordar tarjeta */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              gap: '10px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: `2px solid ${colors.gray[400]}`,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                background: cardData.recordarTarjeta ? colors.primary : 'transparent'
              }}>
                {cardData.recordarTarjeta && (
                  <span style={{ color: 'white', fontSize: '14px' }}>✓</span>
                )}
              </div>
              <input
                type="checkbox"
                checked={cardData.recordarTarjeta}
                onChange={(e) => setCardData(prev => ({ ...prev, recordarTarjeta: e.target.checked }))}
                style={{ display: 'none' }}
              />
              <span style={{ fontSize: '14px', color: colors.gray[700] }}>
                Recordar tarjeta para futuras compras
              </span>
            </label>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                background: colors.gray[200],
                color: colors.gray[900],
                border: 'none',
                padding: '16px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = colors.gray[300]}
              onMouseLeave={(e) => e.currentTarget.style.background = colors.gray[200]}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                background: loading ? colors.gray[400] : colors.success,
                color: 'white',
                border: 'none',
                padding: '16px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.opacity = '1';
              }}
            >
              {loading ? 'Procesando...' : `Pagar $${monto.toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Carrito = ({ 
  carrito, 
  onActualizarCantidad, 
  onRemover, 
  total,
  onLimpiar,
  puntosEntrega
}) => {
  const { realizarPedido, user } = useCliente();
  
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    telefono: '',
    puntoEntregaId: '',
    notas: ''
  });
  const [enviando, setEnviando] = useState(false);
  const [pasoActual, setPasoActual] = useState(1);
  const [metodoPago, setMetodoPago] = useState('');
  const [mostrarModalTarjeta, setMostrarModalTarjeta] = useState(false);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);

  useEffect(() => {
    // Cerrar el formulario cuando se limpia el carrito
    if (carrito.length === 0 && mostrarFormulario) {
      setMostrarFormulario(false);
      setPasoActual(1);
    }
  }, [carrito.length, mostrarFormulario]);

  const handleRealizarPedido = async () => {
    if (carrito.length === 0) return;
    
    if (!user || !user.id) {
      alert('⚠️ Debes iniciar sesión para realizar un pedido');
      return;
    }
    
    if (pasoActual === 1) {
      if (!formData.telefono || !formData.puntoEntregaId) {
        alert('Por favor completa los campos requeridos');
        return;
      }
      setPasoActual(2);
      return;
    }

    if (pasoActual === 2) {
      if (!metodoPago) {
        alert('Por favor selecciona un método de pago');
        return;
      }
      
      // Si seleccionó pago con tarjeta, mostrar modal
      if (metodoPago === 'tarjeta') {
        setMostrarModalTarjeta(true);
        return;
      }
      
      // Si es contra entrega, procesar directamente
      await procesarPedido('contra_entrega');
    }
  };

  const procesarPedido = async (metodo) => {
    setEnviando(true);
    try {
      const puntoSeleccionado = puntosEntrega.find(p => p.id === parseInt(formData.puntoEntregaId));
      
      if (!puntoSeleccionado) {
        alert('⚠️ Punto de entrega no válido');
        return;
      }

      const datosCliente = {
        mesa: 'Delivery',
        ubicacion: puntoSeleccionado.direccion,
        notas: `Teléfono: ${formData.telefono}. Punto de entrega: ${puntoSeleccionado.nombre}. ${formData.notas || ''}`,
        metodo_pago: metodo,
        estado_pago: metodo === 'tarjeta' ? 'pagado' : 'pendiente'
      };

      // ✅ LLAMAR A LA API REAL PARA GUARDAR EN LA BASE DE DATOS
      const resultado = await realizarPedido(datosCliente, carrito);
      
      setPedidoConfirmado({
        success: true,
        pedido: resultado.pedido,
        mensaje: metodo === 'contra_entrega' 
          ? 'Pedido guardado en la base de datos. Pague al recibir su pedido.' 
          : 'Pedido pagado y guardado en la base de datos.'
      });
      
      // Limpiar después de 5 segundos
      setTimeout(() => {
        setMostrarFormulario(false);
        setPasoActual(1);
        setFormData({ telefono: '', puntoEntregaId: '', notas: '' });
        setMetodoPago('');
        onLimpiar();
        setPedidoConfirmado(null);
      }, 5000);
      
    } catch (error) {
      console.error('❌ Error al guardar en la base de datos:', error);
      alert(`❌ Error al guardar el pedido: ${error.message}`);
    } finally {
      setEnviando(false);
    }
  };

  const handlePagoTarjetaSuccess = async (pagoResult) => {
    setMostrarModalTarjeta(false);
    await procesarPedido('tarjeta');
  };

  const renderMetodosPago = () => {
    return (
      <div style={{ marginTop: '24px' }}>
        <h4 style={{ 
          margin: '0 0 16px 0', 
          fontSize: '16px',
          fontWeight: '700',
          color: colors.gray[900]
        }}>
          Método de Pago
        </h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Contra entrega */}
          <div
            onClick={() => setMetodoPago('contra_entrega')}
            style={{
              padding: '16px',
              border: `2px solid ${metodoPago === 'contra_entrega' ? colors.secondary : colors.gray[300]}`,
              background: metodoPago === 'contra_entrega' ? colors.secondary + '10' : colors.gray[50],
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (metodoPago !== 'contra_entrega') {
                e.currentTarget.style.borderColor = colors.gray[400];
              }
            }}
            onMouseLeave={(e) => {
              if (metodoPago !== 'contra_entrega') {
                e.currentTarget.style.borderColor = colors.gray[300];
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: `2px solid ${metodoPago === 'contra_entrega' ? colors.secondary : colors.gray[400]}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {metodoPago === 'contra_entrega' && (
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: colors.secondary
                  }}></div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px'
                }}>
                  <div style={{ 
                    fontWeight: '700', 
                    color: colors.gray[900],
                    fontSize: '15px'
                  }}>
                    Contra Entrega
                  </div>
                  <div style={{ fontSize: '24px' }}>💵</div>
                </div>
                <div style={{ 
                  fontSize: '13px',
                  color: colors.gray[600],
                  lineHeight: '1.4'
                }}>
                  Pague con efectivo o tarjeta al recibir su pedido
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta (sólo vista, no API real) */}
          <div
            onClick={() => setMetodoPago('tarjeta')}
            style={{
              padding: '16px',
              border: `2px solid ${metodoPago === 'tarjeta' ? colors.primary : colors.gray[300]}`,
              background: metodoPago === 'tarjeta' ? colors.primary + '10' : colors.gray[50],
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (metodoPago !== 'tarjeta') {
                e.currentTarget.style.borderColor = colors.gray[400];
              }
            }}
            onMouseLeave={(e) => {
              if (metodoPago !== 'tarjeta') {
                e.currentTarget.style.borderColor = colors.gray[300];
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: `2px solid ${metodoPago === 'tarjeta' ? colors.primary : colors.gray[400]}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {metodoPago === 'tarjeta' && (
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: colors.primary
                  }}></div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px'
                }}>
                  <div style={{ 
                    fontWeight: '700', 
                    color: colors.gray[900],
                    fontSize: '15px'
                  }}>
                    Tarjeta de Crédito/Débito
                  </div>
                  <div style={{ fontSize: '24px' }}>💳</div>
                </div>
                <div style={{ 
                  fontSize: '13px',
                  color: colors.gray[600],
                  lineHeight: '1.4'
                }}>
                  Pago en línea seguro con VISA, MasterCard, American Express
                </div>
                <div style={{ 
                  fontSize: '11px',
                  color: colors.warning,
                  marginTop: '4px',
                  fontStyle: 'italic'
                }}>
                  ⚠️ Vista previa - El pago real se implementará posteriormente
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResumenPedido = () => {
    const puntoSeleccionado = puntosEntrega.find(p => p.id === parseInt(formData.puntoEntregaId));
    
    return (
      <div style={{ marginTop: '24px' }}>
        <h4 style={{ 
          margin: '0 0 16px 0', 
          fontSize: '16px',
          fontWeight: '700',
          color: colors.gray[900]
        }}>
          Confirmar Pedido
        </h4>
        
        {/* Información del usuario */}
        <div style={{
          background: colors.primary + '10',
          padding: '16px',
          border: `2px solid ${colors.primary}30`,
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <div style={{
            fontSize: '11px',
            color: colors.gray[600],
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '6px'
          }}>
            👤 Cliente
          </div>
          <div style={{
            fontWeight: '700',
            color: colors.gray[900],
            fontSize: '14px'
          }}>
            {user?.nombre || user?.email || 'Usuario'}
          </div>
          <div style={{
            fontSize: '12px',
            color: colors.gray[600],
            marginTop: '2px'
          }}>
            ID: {user?.id}
          </div>
        </div>

        {/* Información de entrega */}
        <div style={{
          background: colors.gray[50],
          padding: '16px',
          border: `2px solid ${colors.gray[200]}`,
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ 
              fontSize: '11px', 
              color: colors.gray[600],
              marginBottom: '4px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Teléfono
            </div>
            <div style={{ 
              fontWeight: '600',
              color: colors.gray[900]
            }}>
              {formData.telefono}
            </div>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <div style={{ 
              fontSize: '11px', 
              color: colors.gray[600],
              marginBottom: '4px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Punto de Entrega
            </div>
            <div style={{ 
              fontWeight: '700',
              color: colors.primary,
              marginBottom: '4px'
            }}>
              {puntoSeleccionado?.nombre}
            </div>
            <div style={{ 
              fontWeight: '500',
              color: colors.gray[600],
              fontSize: '12px'
            }}>
              {puntoSeleccionado?.direccion}
            </div>
          </div>
          
          {formData.notas && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ 
                fontSize: '11px', 
                color: colors.gray[600],
                marginBottom: '4px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Notas
              </div>
              <div style={{ 
                fontWeight: '600',
                color: colors.gray[900]
              }}>
                {formData.notas}
              </div>
            </div>
          )}
          
          {/* Método de pago seleccionado */}
          <div>
            <div style={{ 
              fontSize: '11px', 
              color: colors.gray[600],
              marginBottom: '4px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Método de Pago
            </div>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px',
              background: metodoPago === 'tarjeta' ? colors.primary + '10' : colors.secondary + '10',
              borderRadius: '6px',
              border: `1px solid ${metodoPago === 'tarjeta' ? colors.primary + '30' : colors.secondary + '30'}`
            }}>
              <div style={{ fontSize: '20px' }}>
                {metodoPago === 'tarjeta' ? '💳' : '💵'}
              </div>
              <div>
                <div style={{ 
                  fontWeight: '700',
                  color: colors.gray[900],
                  fontSize: '13px'
                }}>
                  {metodoPago === 'tarjeta' ? 'Tarjeta de Crédito/Débito' : 'Contra Entrega'}
                </div>
                <div style={{ 
                  fontSize: '11px',
                  color: colors.gray[600]
                }}>
                  {metodoPago === 'tarjeta' 
                    ? 'El pedido se guardará como pagado' 
                    : 'Pague al recibir su pedido'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total */}
        <div style={{
          padding: '16px',
          background: colors.primary,
          color: 'white',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ 
                fontSize: '12px', 
                opacity: 0.9,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Total a pagar
              </div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>
                {metodoPago === 'tarjeta' ? 'Pago inmediato' : 'Pagar al recibir'}
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800' }}>
              ${total.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Resumen de productos */}
        <div style={{
          background: colors.gray[50],
          padding: '16px',
          border: `2px solid ${colors.gray[200]}`,
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{ 
            fontSize: '11px', 
            color: colors.gray[600],
            marginBottom: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Resumen de productos ({carrito.length})
          </div>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {carrito.map(item => (
              <div key={item.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: `1px solid ${colors.gray[200]}`,
                fontSize: '13px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    background: colors.primary + '20',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: colors.primary
                  }}>
                    {item.cantidad}
                  </div>
                  <div>{item.nombre}</div>
                </div>
                <div style={{ fontWeight: '600' }}>
                  ${(item.precio * item.cantidad).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderConfirmacionPedido = () => {
    if (!pedidoConfirmado) return null;
    
    const esContraEntrega = pedidoConfirmado.pedido.metodo_pago === 'contra_entrega';
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        backdropFilter: 'blur(4px)'
      }}>
        <div style={{
          background: colors.background,
          maxWidth: '500px',
          width: '100%',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.3s ease-out'
        }}>
          {/* Header */}
          <div style={{
            background: esContraEntrega ? colors.warning : colors.success,
            padding: '32px 24px',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>
              {esContraEntrega ? '✅' : '🎉'}
            </div>
            <h3 style={{ 
              margin: 0, 
              fontSize: '24px', 
              fontWeight: '700',
              marginBottom: '8px'
            }}>
              ¡Pedido Guardado en Base de Datos!
            </h3>
            <p style={{ 
              margin: 0, 
              opacity: 0.9, 
              fontSize: '14px' 
            }}>
              {pedidoConfirmado.mensaje}
            </p>
          </div>

          {/* Detalles del pedido */}
          <div style={{ padding: '24px' }}>
            <div style={{
              background: colors.gray[50],
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: `1px solid ${colors.gray[200]}`
            }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: colors.gray[600],
                    marginBottom: '4px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    N° Pedido
                  </div>
                  <div style={{ 
                    fontWeight: '700',
                    color: colors.gray[900],
                    fontSize: '18px'
                  }}>
                    #{pedidoConfirmado.pedido.numero_pedido}
                  </div>
                </div>
                <div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: colors.gray[600],
                    marginBottom: '4px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Total
                  </div>
                  <div style={{ 
                    fontWeight: '700',
                    color: colors.success,
                    fontSize: '18px'
                  }}>
                    ${pedidoConfirmado.pedido.total.toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ 
                  fontSize: '11px', 
                  color: colors.gray[600],
                  marginBottom: '4px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Método de Pago
                </div>
                <div style={{ 
                  fontWeight: '600',
                  color: colors.gray[900],
                  fontSize: '14px'
                }}>
                  {esContraEntrega ? 'Contra Entrega' : 'Tarjeta'}
                </div>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ 
                  fontSize: '11px', 
                  color: colors.gray[600],
                  marginBottom: '4px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Estado en BD
                </div>
                <div style={{ 
                  display: 'inline-block',
                  padding: '4px 12px',
                  background: esContraEntrega ? colors.warning + '20' : colors.success + '20',
                  color: esContraEntrega ? colors.warning : colors.success,
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {esContraEntrega ? 'Pendiente de pago' : 'Pagado'}
                </div>
              </div>

              <div>
                <div style={{ 
                  fontSize: '11px', 
                  color: colors.gray[600],
                  marginBottom: '4px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Usuario ID
                </div>
                <div style={{ 
                  fontWeight: '600',
                  color: colors.gray[900],
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}>
                  {pedidoConfirmado.pedido.usuario_id}
                </div>
              </div>
            </div>
            
            {esContraEntrega && (
              <div style={{
                background: colors.warning + '10',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: `1px solid ${colors.warning}30`
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ 
                    background: colors.warning,
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>💵</span>
                  </div>
                  <div>
                    <div style={{ 
                      fontWeight: '600', 
                      color: colors.gray[900],
                      marginBottom: '4px'
                    }}>
                      Prepare el pago
                    </div>
                    <div style={{ fontSize: '13px', color: colors.gray[700] }}>
                      Tenga listo el efectivo o tarjeta al momento de recibir su pedido
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div style={{ 
              fontSize: '11px', 
              color: colors.gray[600],
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              ✅ Pedido guardado correctamente en la base de datos
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => {
                  setPedidoConfirmado(null);
                  setMostrarFormulario(false);
                  setPasoActual(1);
                  setFormData({ telefono: '', puntoEntregaId: '', notas: '' });
                  setMetodoPago('');
                  onLimpiar();
                }}
                style={{
                  background: colors.primary,
                  color: 'white',
                  border: 'none',
                  padding: '14px 32px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Cerrar y Continuar Comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (carrito.length === 0) {
    return (
      <div style={{
        background: colors.cardBg,
        border: `2px solid ${colors.gray[200]}`,
        padding: '48px 24px',
        textAlign: 'center',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}>
        <div style={{ 
          fontSize: '64px', 
          marginBottom: '16px',
          color: colors.gray[300]
        }}>
          🛒
        </div>
        <h3 style={{ 
          margin: '0 0 8px 0',
          fontSize: '18px',
          fontWeight: '700',
          color: colors.gray[900]
        }}>
          Tu carrito está vacío
        </h3>
        <p style={{ 
          margin: 0,
          fontSize: '14px',
          color: colors.gray[600]
        }}>
          Agrega productos para comenzar
        </p>
        
        {user && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            background: colors.gray[50],
            border: `1px solid ${colors.gray[200]}`,
            borderRadius: '8px',
            fontSize: '13px',
            color: colors.gray[700]
          }}>
            👤 Sesión: <strong>{user.nombre || user.email}</strong>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div style={{
        background: colors.cardBg,
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        border: `1px solid ${colors.border}`,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header del carrito */}
        <div style={{
          padding: '24px',
          borderBottom: `2px solid ${colors.gray[200]}`,
          background: colors.gray[50]
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: colors.primary,
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: colors.background,
                fontWeight: 'bold'
              }}>
                🛒
              </div>
              <div>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: '18px',
                  fontWeight: '700',
                  color: colors.gray[900]
                }}>
                  Mi Pedido
                </h3>
                <p style={{ 
                  margin: '2px 0 0 0',
                  fontSize: '12px',
                  color: colors.gray[600],
                  fontWeight: '500'
                }}>
                  {carrito.length} {carrito.length === 1 ? 'producto' : 'productos'}
                </p>
              </div>
            </div>
            
            <button
              onClick={onLimpiar}
              style={{
                background: colors.danger,
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderRadius: '6px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Limpiar
            </button>
          </div>
          
          {user && (
            <div style={{
              marginTop: '16px',
              padding: '10px',
              background: colors.background,
              border: `1px solid ${colors.gray[200]}`,
              borderRadius: '8px',
              fontSize: '12px',
              color: colors.gray[700],
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '16px' }}>👤</span>
              <div>
                <div style={{ fontWeight: '600', color: colors.gray[900] }}>
                  {user.nombre || 'Usuario'}
                </div>
                <div style={{ fontSize: '11px', color: colors.gray[600] }}>
                  {user.email}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lista de productos */}
        <div style={{ 
          flex: 1,
          overflowY: 'auto', 
          padding: '16px'
        }}>
          {carrito.map(item => (
            <div 
              key={item.id} 
              style={{
                padding: '16px',
                marginBottom: '12px',
                background: colors.gray[50],
                border: `1px solid ${colors.gray[200]}`,
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.gray[300];
                e.currentTarget.style.background = colors.background;
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.gray[200];
                e.currentTarget.style.background = colors.gray[50];
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px'
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontWeight: '700', 
                    fontSize: '14px',
                    marginBottom: '4px',
                    color: colors.gray[900],
                    lineHeight: '1.4'
                  }}>
                    {item.nombre}
                  </div>
                  <div style={{ 
                    fontSize: '13px',
                    color: colors.gray[600],
                    fontWeight: '600'
                  }}>
                    ${item.precio} × {item.cantidad} = <span style={{ color: colors.primary }}>${(item.precio * item.cantidad).toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => onRemover(item.id)}
                  style={{
                    background: colors.danger,
                    color: 'white',
                    border: 'none',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '12px',
                    flexShrink: 0,
                    borderRadius: '6px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  ×
                </button>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px'
              }}>
                <button
                  onClick={() => onActualizarCantidad(item.id, item.cantidad - 1)}
                  style={{
                    background: colors.gray[200],
                    color: colors.gray[900],
                    border: 'none',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = colors.gray[300]}
                  onMouseLeave={(e) => e.currentTarget.style.background = colors.gray[200]}
                >
                  −
                </button>
                
                <div style={{
                  minWidth: '40px',
                  textAlign: 'center',
                  fontWeight: '700',
                  fontSize: '16px',
                  color: colors.gray[900]
                }}>
                  {item.cantidad}
                </div>
                
                <button
                  onClick={() => onActualizarCantidad(item.id, item.cantidad + 1)}
                  style={{
                    background: colors.primary,
                    color: 'white',
                    border: 'none',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = colors.primaryLight}
                  onMouseLeave={(e) => e.currentTarget.style.background = colors.primary}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total y botón de acción */}
        <div style={{
          borderTop: `2px solid ${colors.gray[200]}`,
          padding: '24px',
          background: colors.gray[50]
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            padding: '16px',
            background: colors.background,
            border: `2px solid ${colors.gray[200]}`,
            borderRadius: '8px'
          }}>
            <div>
              <div style={{ 
                fontSize: '12px', 
                color: colors.gray[600],
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px'
              }}>
                Total a pagar
              </div>
              <div style={{ 
                fontSize: '28px', 
                fontWeight: '800',
                color: colors.gray[900]
              }}>
                ${total.toFixed(2)}
              </div>
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: colors.gray[500],
              textAlign: 'right',
              fontWeight: '500'
            }}>
              Incluye<br/>impuestos
            </div>
          </div>

          {!mostrarFormulario ? (
            <button
              onClick={() => {
                if (!user || !user.uid) {
                  alert('⚠️ Debes iniciar sesión para realizar un pedido');
                  return;
                }
                setMostrarFormulario(true);
              }}
              style={{
                background: colors.secondary,
                color: 'white',
                border: 'none',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderRadius: '8px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = colors.accent}
              onMouseLeave={(e) => e.currentTarget.style.background = colors.secondary}
            >
              Proceder al Pago →
            </button>
          ) : (
            <div>
              {/* Indicador de pasos */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '24px',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '24px',
                  right: '24px',
                  height: '2px',
                  background: colors.gray[200],
                  zIndex: 1
                }}></div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 2
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: pasoActual >= 1 ? colors.primary : colors.gray[300],
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}>
                    1
                  </div>
                  <span style={{ 
                    fontSize: '12px',
                    fontWeight: '600',
                    color: pasoActual >= 1 ? colors.gray[900] : colors.gray[500]
                  }}>
                    Datos
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 2
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: pasoActual >= 2 ? colors.primary : colors.gray[300],
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}>
                    2
                  </div>
                  <span style={{ 
                    fontSize: '12px',
                    fontWeight: '600',
                    color: pasoActual >= 2 ? colors.gray[900] : colors.gray[500]
                  }}>
                    Pago
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 2
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: pasoActual >= 3 ? colors.primary : colors.gray[300],
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}>
                    3
                  </div>
                  <span style={{ 
                    fontSize: '12px',
                    fontWeight: '600',
                    color: pasoActual >= 3 ? colors.gray[900] : colors.gray[500]
                  }}>
                    Confirmar
                  </span>
                </div>
              </div>

              {/* Paso 1: Datos de entrega */}
              {pasoActual === 1 && (
                <div>
                  <h4 style={{ 
                    margin: '0 0 16px 0', 
                    fontSize: '16px',
                    fontWeight: '700',
                    color: colors.gray[900]
                  }}>
                    Información de entrega
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: colors.gray[700],
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        placeholder="Tu número de contacto"
                        value={formData.telefono}
                        onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                        style={{
                          padding: '12px',
                          border: `2px solid ${colors.gray[300]}`,
                          fontSize: '14px',
                          width: '100%',
                          background: colors.background,
                          color: colors.gray[900],
                          outline: 'none',
                          fontWeight: '500',
                          boxSizing: 'border-box',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = colors.primary}
                        onBlur={(e) => e.target.style.borderColor = colors.gray[300]}
                      />
                    </div>
                    
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: colors.gray[700],
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Punto de Entrega *
                      </label>
                      <select
                        value={formData.puntoEntregaId}
                        onChange={(e) => setFormData(prev => ({ ...prev, puntoEntregaId: e.target.value }))}
                        style={{
                          padding: '12px',
                          border: `2px solid ${colors.gray[300]}`,
                          fontSize: '14px',
                          width: '100%',
                          background: colors.background,
                          color: colors.gray[900],
                          outline: 'none',
                          fontWeight: '500',
                          boxSizing: 'border-box',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = colors.primary}
                        onBlur={(e) => e.target.style.borderColor = colors.gray[300]}
                      >
                        <option value="">Selecciona un punto de entrega</option>
                        {puntosEntrega.map(punto => (
                          <option key={punto.id} value={punto.id}>
                            {punto.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: colors.gray[700],
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Notas (opcional)
                      </label>
                      <textarea
                        placeholder="Instrucciones especiales, alergias, etc."
                        value={formData.notas}
                        onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
                        rows="3"
                        style={{
                          padding: '12px',
                          border: `2px solid ${colors.gray[300]}`,
                          fontSize: '14px',
                          width: '100%',
                          background: colors.background,
                          color: colors.gray[900],
                          outline: 'none',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          fontWeight: '500',
                          boxSizing: 'border-box',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = colors.primary}
                        onBlur={(e) => e.target.style.borderColor = colors.gray[300]}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 2: Método de pago */}
              {pasoActual === 2 && renderMetodosPago()}

              {/* Paso 3: Confirmación */}
              {pasoActual === 3 && renderResumenPedido()}
              
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                marginTop: '24px' 
              }}>
                <button
                  onClick={() => {
                    if (pasoActual === 1) {
                      setMostrarFormulario(false);
                    } else {
                      setPasoActual(pasoActual - 1);
                    }
                  }}
                  disabled={enviando}
                  style={{
                    background: colors.gray[200],
                    color: colors.gray[900],
                    border: 'none',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: enviando ? 'not-allowed' : 'pointer',
                    flex: 1,
                    transition: 'all 0.2s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderRadius: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (!enviando) e.currentTarget.style.background = colors.gray[300];
                  }}
                  onMouseLeave={(e) => {
                    if (!enviando) e.currentTarget.style.background = colors.gray[200];
                  }}
                >
                  {pasoActual === 1 ? 'Cancelar' : '← Atrás'}
                </button>
                
                <button
                  onClick={handleRealizarPedido}
                  disabled={enviando || 
                    (pasoActual === 1 && (!formData.telefono || !formData.puntoEntregaId)) ||
                    (pasoActual === 2 && !metodoPago)
                  }
                  style={{
                    background: enviando ? colors.gray[400] : colors.success,
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: enviando || 
                      (pasoActual === 1 && (!formData.telefono || !formData.puntoEntregaId)) ||
                      (pasoActual === 2 && !metodoPago) ? 'not-allowed' : 'pointer',
                    flex: 1,
                    transition: 'all 0.2s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderRadius: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (!enviando && !(pasoActual === 1 && (!formData.telefono || !formData.puntoEntregaId)) && !(pasoActual === 2 && !metodoPago)) {
                      e.currentTarget.style.opacity = '0.9';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!enviando && !(pasoActual === 1 && (!formData.telefono || !formData.puntoEntregaId)) && !(pasoActual === 2 && !metodoPago)) {
                      e.currentTarget.style.opacity = '1';
                    }
                  }}
                >
                  {enviando ? 'Procesando...' : 
                   pasoActual === 1 ? 'Continuar →' : 
                   pasoActual === 2 ? '✓ Continuar' : 
                   '✓ Guardar en Base de Datos'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de pago con tarjeta (SÓLO VISTA) */}
      <ModalPagoTarjeta
        isOpen={mostrarModalTarjeta}
        onClose={() => setMostrarModalTarjeta(false)}
        onPaymentSuccess={handlePagoTarjetaSuccess}
        monto={total}
        loading={enviando}
      />

      {/* Modal de confirmación del pedido */}
      {renderConfirmacionPedido()}
    </>
  );
};

export default Carrito;