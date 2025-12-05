// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const PrivateRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  console.log('🔐 [PrivateRoute] Verificando acceso...');
  console.log('  - Ruta:', location.pathname);
  console.log('  - isAuthenticated:', isAuthenticated);
  console.log('  - Usuario:', user);
  console.log('  - Loading:', loading);

  // Mientras carga, no mostramos nada (o un spinner)
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px'
      }}>
        ⏳ Cargando...
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    console.log('❌ [PrivateRoute] No autenticado - Redirigiendo a /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se especificaron roles permitidos, verificar
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.rol)) {
    console.log('❌ [PrivateRoute] Rol no permitido:', user?.rol);
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('✅ [PrivateRoute] Acceso permitido');
  
  // Renderizar las rutas hijas
  return <Outlet />;
};

export default PrivateRoute;