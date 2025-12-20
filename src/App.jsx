// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { useAuth } from './AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout/Layout';
import MenuPage from './pages/Cliente/MenuPage';
import CarritoPage from './pages/Cliente/CarritoPage';
import Login from './components/Login';
import MisPedidosPage from './pages/Cliente/MisPedidosPage';
import PerfilPage from './pages/Cliente/PerfilPage';

// 🔥 Componente para manejar la ruta raíz "/"
const RootRedirect = () => {
  const { isAuthenticated, user } = useAuth();

  console.log('🎯 [RootRedirect] Redirigiendo desde "/"...');
  console.log('  - isAuthenticated:', isAuthenticated);
  console.log('  - user:', user);

  if (!isAuthenticated) {
    console.log('  → Redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }

  // Redirigir según el rol del usuario
  const redirectMap = {
    'administrador': '/cliente/menu',
    'empleado': '/cliente/menu',
    'mesero': '/cliente/menu',
    'cocina': '/cliente/menu',
    'cliente': '/cliente/menu',
  };

  const destination = redirectMap[user?.rol] || '/cliente/menu';
  console.log(`  → Redirigiendo a ${destination} (rol: ${user?.rol})`);
  
  return <Navigate to={destination} replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          
            <Route element={<Layout />}>
              {/* Rutas de Cliente */}
              <Route path="/cliente/menu" element={<MenuPage />} />
              <Route path="/Mis-Pedidos" element={<MisPedidosPage />} />
              <Route path="/Perfil" element={<PerfilPage />} />
              <Route path="/Carrito" element={<CarritoPage />} />
            </Route>
          

          {/* 🚫 Página no autorizada */}
          <Route 
            path="/unauthorized" 
            element={
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                gap: '20px'
              }}>
                <h1 style={{ fontSize: '48px' }}>🚫</h1>
                <h2>No tienes acceso a esta página</h2>
                <button 
                  onClick={() => window.location.href = '/'}
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#E74C3C',
                    color: 'white',
                    fontWeight: '600'
                  }}
                >
                  Ir al inicio
                </button>
              </div>
            } 
          />

          {/* ❓ Ruta 404 - Cualquier otra ruta */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;