// src/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { usuarioService } from './services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 🔥 Empieza en true
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar si hay usuario en localStorage al cargar
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    console.log('🔍 [AuthContext] Verificando sesión...');
    console.log('  - Token:', storedToken ? 'Presente' : 'No encontrado');
    console.log('  - User:', storedUser ? 'Presente' : 'No encontrado');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log('✅ [AuthContext] Sesión restaurada:', parsedUser);
      } catch (err) {
        console.error('❌ [AuthContext] Error parseando usuario:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } else {
      console.log('ℹ️ [AuthContext] No hay sesión guardada');
    }
    
    setLoading(false); // 🔥 Termina la carga inicial
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 [AuthContext] Iniciando login para:', email);
      
      // ✅ Llamar a tu API de login REAL
      const response = await usuarioService.login({ email, password });
      
      console.log('📦 [AuthContext] Respuesta del servidor:', response.data);
      
      const { success, data, message } = response.data;
      
      if (!success) {
        throw new Error(message || 'Error en el login');
      }
      
      if (!data?.token || !data?.usuario) {
        throw new Error('Respuesta inválida del servidor');
      }
      
      console.log('✅ [AuthContext] Login exitoso');
      console.log('  - Usuario:', data.usuario);
      console.log('  - Rol:', data.usuario.rol);
      console.log('  - Redirección:', data.redireccion);
      
      // Guardar en localStorage
      localStorage.setItem('user', JSON.stringify(data.usuario));
      localStorage.setItem('token', data.token);
      if (data.redireccion) {
        localStorage.setItem('redireccion', data.redireccion);
      }
      
      // 🔥 Actualizar el estado ANTES de devolver
      setUser(data.usuario);
      
      // 🔥 Pequeña pausa para asegurar que el estado se actualice
      await new Promise(resolve => setTimeout(resolve, 50));
      
      return { 
        success: true, 
        user: data.usuario, 
        redireccion: data.redireccion 
      };
      
    } catch (err) {
      console.error('❌ [AuthContext] Error en login:', err);
      
      let errorMessage = 'Error al iniciar sesión';
      
      if (err.response) {
        errorMessage = err.response.data?.error || 
                      err.response.data?.message || 
                      err.response.data?.mensaje ||
                      `Error del servidor: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'No se pudo conectar con el servidor';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 [AuthContext] Iniciando registro para:', userData.email);
      
      const response = await usuarioService.registro(userData);
      const { success, data, message } = response.data;
      
      if (!success) {
        throw new Error(message || 'Error en el registro');
      }
      
      // Si el registro devuelve token (auto-login)
      if (data?.token && data?.usuario) {
        localStorage.setItem('user', JSON.stringify(data.usuario));
        localStorage.setItem('token', data.token);
        setUser(data.usuario);
      }
      
      return { success: true, user: data.usuario };
      
    } catch (err) {
      console.error('❌ [AuthContext] Error en registro:', err);
      
      let errorMessage = 'Error al registrarse';
      
      if (err.response) {
        errorMessage = err.response.data?.error || 
                      err.response.data?.message ||
                      'Error en el registro';
      } else if (err.request) {
        errorMessage = 'No se pudo conectar con el servidor';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('👋 [AuthContext] Cerrando sesión...');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('redireccion');
    setUser(null);
    setError(null);
    console.log('✅ [AuthContext] Sesión cerrada');
  };

  const updateUser = (userData) => {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      console.error('❌ [AuthContext] Error actualizando usuario:', err);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    error,
    setError,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'administrador',
    isEmpleado: user?.rol === 'empleado',
    isMesero: user?.rol === 'mesero',
    isCocina: user?.rol === 'cocina',
    isCliente: user?.rol === 'cliente',
  };

  // 🔥 IMPORTANTE: No renderizar children hasta que termine la carga inicial
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        🔥 Cargando Alpunto...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};