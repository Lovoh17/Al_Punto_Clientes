import React from 'react';

const ProductoCard = ({ producto, onAgregar }) => {
  return (
    <div style={{
      border: '1px solid #e0e0e0',
      padding: '16px',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'box-shadow 0.2s ease',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    }}
    >
      {/* Icono del producto */}
      <div style={{
        height: '80px',
        background: '#f8f9fa',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #dee2e6',
        fontSize: '32px'
      }}>
        {producto.categoria_id === 1 ? '🥤' : 
         producto.categoria_id === 2 ? '🍽️' :
         producto.categoria_id === 3 ? '🍤' :
         producto.categoria_id === 4 ? '🍰' : '📦'}
      </div>
      
      {/* Información del producto */}
      <div style={{ flex: 1 }}>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          color: '#212529',
          fontSize: '16px',
          fontWeight: '600',
          lineHeight: '1.4'
        }}>
          {producto.nombre}
        </h3>
        
        <p style={{ 
          margin: '0 0 12px 0', 
          color: '#6c757d',
          fontSize: '14px',
          lineHeight: '1.4'
        }}>
          {producto.descripcion}
        </p>
      </div>
      
      {/* Precio y botón */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid #e9ecef',
        paddingTop: '12px'
      }}>
        <span style={{ 
          color: '#198754',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          ${producto.precio}
        </span>
        
        <button 
          onClick={() => onAgregar(producto)}
          style={{
            background: '#007bff',
            color: '#ffffff',
            border: '1px solid #007bff',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#0056b3';
            e.currentTarget.style.borderColor = '#0056b3';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#007bff';
            e.currentTarget.style.borderColor = '#007bff';
          }}
        >
          Agregar
        </button>
      </div>
    </div>
  );
};

export default ProductoCard;