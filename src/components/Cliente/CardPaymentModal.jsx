import React, { useState } from 'react';

const CardPaymentModal = ({ 
  isOpen, 
  onClose, 
  onPaymentSuccess, 
  amount, 
  orderNumber,
  loading = false 
}) => {
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    saveCard: false
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    
    if (!cardData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      newErrors.cardNumber = 'Número de tarjeta inválido (16 dígitos)';
    }
    
    if (!cardData.cardHolder.trim()) {
      newErrors.cardHolder = 'Nombre del titular es requerido';
    }
    
    if (!cardData.expiryMonth || !cardData.expiryYear) {
      newErrors.expiry = 'Fecha de expiración requerida';
    } else {
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (parseInt(cardData.expiryYear) < currentYear || 
          (parseInt(cardData.expiryYear) === currentYear && parseInt(cardData.expiryMonth) < currentMonth)) {
        newErrors.expiry = 'Tarjeta expirada';
      }
    }
    
    if (!cardData.cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = 'CVV inválido (3-4 dígitos)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Formatear datos para enviar
      const paymentData = {
        cardNumber: cardData.cardNumber.replace(/\s/g, ''),
        cardHolder: cardData.cardHolder,
        expiry: `${cardData.expiryMonth}/${cardData.expiryYear}`,
        cvv: cardData.cvv,
        monto: amount,
        orderNumber: orderNumber,
        timestamp: new Date().toISOString()
      };
      
      onPaymentSuccess(paymentData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Formatear número de tarjeta
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    return parts.length ? parts.join(' ') : value;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardData(prev => ({ ...prev, cardNumber: formatted }));
  };

  // Generar años y meses
  const months = Array.from({ length: 12 }, (_, i) => 
    String(i + 1).padStart(2, '0')
  );
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => 
    String(currentYear + i).slice(-2)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Pago con Tarjeta</h2>
              <p className="text-gray-600 mt-1">Complete los datos de su tarjeta</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={loading}
            >
              ×
            </button>
          </div>
          
          {/* Monto */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Monto a pagar:</span>
              <span className="text-2xl font-bold text-blue-600">${amount.toFixed(2)}</span>
            </div>
            {orderNumber && (
              <p className="text-sm text-gray-500 mt-1">
                Pedido: <span className="font-semibold">{orderNumber}</span>
              </p>
            )}
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Número de tarjeta */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de tarjeta
            </label>
            <div className="relative">
              <input
                type="text"
                name="cardNumber"
                value={cardData.cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                className={`w-full p-3 pl-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              <div className="absolute left-3 top-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="absolute right-3 top-3 flex space-x-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">VISA</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">MC</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">AMEX</span>
              </div>
            </div>
            {errors.cardNumber && (
              <p className="text-sm text-red-600 mt-1">{errors.cardNumber}</p>
            )}
          </div>

          {/* Nombre del titular */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del titular
            </label>
            <input
              type="text"
              name="cardHolder"
              value={cardData.cardHolder}
              onChange={handleInputChange}
              placeholder="Como aparece en la tarjeta"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.cardHolder ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.cardHolder && (
              <p className="text-sm text-red-600 mt-1">{errors.cardHolder}</p>
            )}
          </div>

          {/* Fecha de expiración y CVV */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de expiración
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  name="expiryMonth"
                  value={cardData.expiryMonth}
                  onChange={handleInputChange}
                  className={`p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.expiry ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="">Mes</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <select
                  name="expiryYear"
                  value={cardData.expiryYear}
                  onChange={handleInputChange}
                  className={`p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.expiry ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="">Año</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              {errors.expiry && (
                <p className="text-sm text-red-600 mt-1">{errors.expiry}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="cvv"
                  value={cardData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength="4"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.cvv ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                <div className="absolute right-3 top-3">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    title="Los 3 o 4 dígitos en la parte trasera de su tarjeta"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              {errors.cvv && (
                <p className="text-sm text-red-600 mt-1">{errors.cvv}</p>
              )}
            </div>
          </div>

          {/* Guardar tarjeta (opcional) */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="saveCard"
                checked={cardData.saveCard}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                disabled={loading}
              />
              <span className="ml-2 text-sm text-gray-700">
                Guardar tarjeta para futuras compras
              </span>
            </label>
          </div>

          {/* Información de seguridad */}
          <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="text-sm text-gray-600">
                  <strong>Pago seguro:</strong> Todos los datos están encriptados. No almacenamos información de su tarjeta.
                </p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Procesando pago...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Pagar ${amount.toFixed(2)}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardPaymentModal;