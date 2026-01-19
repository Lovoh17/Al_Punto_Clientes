import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './services/firebase';
import { usuarioService } from './services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 🔥 REF para prevenir ciclos infinitos
  const isInitializing = useRef(true);
  const hasRedirected = useRef(false);
  
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    console.log('🔥 [AuthContext] Inicializando...');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔄 Usuario Firebase detectado:', firebaseUser?.email);
      
      // Prevenir ejecución múltiple durante inicialización
      if (isInitializing.current) {
        console.log('⏳ Firebase se está inicializando, ignorando...');
        isInitializing.current = false;
        return;
      }
      
      // Si ya redirigimos, no hacer nada más
      if (hasRedirected.current) {
        console.log('✅ Ya redirigido anteriormente');
        return;
      }
      
      // Solo procesar si hay usuario de Firebase y no tenemos usuario en estado
      if (firebaseUser && !user) {
        console.log('🔄 Procesando usuario Firebase...');
        
        // Marcar que vamos a redirigir
        hasRedirected.current = true;
        
        // Pequeño delay para evitar conflictos
        setTimeout(async () => {
          await handleFirebaseUser(firebaseUser);
        }, 500);
      }
    });

    // Verificar sesión existente EN LOCALSTORAGE SOLAMENTE
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log('✅ Sesión restaurada desde localStorage:', parsedUser.email);
      } catch (err) {
        console.error('❌ Error parseando usuario:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    // Marcar que terminó la inicialización inicial
    setTimeout(() => {
      setLoading(false);
      isInitializing.current = false;
    }, 1000);
    
    return () => unsubscribe();
  }, []);

  // 🔵 Login con Google - MODIFICADO
const loginWithGoogle = async () => {
  try {
    setLoading(true);
    setError(null);
    
    console.log('🚀 Iniciando login con Google...');
    
    // 1. Autenticar con Firebase
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;
    
    console.log('✅ Firebase auth exitosa:', firebaseUser.email);
    
    // 2. Preparar datos para el backend
    const userData = {
      id: firebaseUser.uid, // Enviar como 'id'
      email: firebaseUser.email,
      nombre: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
      foto: firebaseUser.photoURL,
      provider: 'google.com',
      password: 'google-auth'
    };
    
    console.log('📤 Enviando datos al backend...', userData);
    
    let backendUser = null;
    
    // 3. Llamar al backend
    try {
      const response = await usuarioService.registro(userData);
      const { success, data } = response.data;
      
      if (success) {
        console.log('✅ Backend respondió exitosamente', data);
        backendUser = data.usuario || data; // Guardar usuario del backend
      }
    } catch (registerError) {
      console.log('ℹ️ Usuario ya existe o error en backend:', registerError.message);
      
      // Si el usuario ya existe, intentar obtenerlo
      try {
        const loginResponse = await usuarioService.login({
          email: firebaseUser.email,
          password: 'google-auth'
        });
        
        if (loginResponse.data.success) {
          backendUser = loginResponse.data.data.usuario;
        }
      } catch (loginError) {
        console.error('❌ Error al hacer login con Google:', loginError);
      }
    }
    
    // 4. Preparar usuario final para localStorage
    let finalUser = userData;
    
    // Si el backend devolvió un usuario, usarlo (tiene el ID correcto de la base de datos)
    if (backendUser) {
      finalUser = {
        ...backendUser,
        // Asegurarse de mantener los datos de Firebase si faltan en backend
        foto: backendUser.foto || firebaseUser.photoURL,
        nombre: backendUser.nombre || firebaseUser.displayName,
        provider: 'google.com'
      };
    }
    
    // 5. Guardar en localStorage y estado
    console.log('💾 Guardando usuario en estado:', finalUser);
    localStorage.setItem('user', JSON.stringify(finalUser));
    localStorage.setItem('token', 'google-auth-token');
    setUser(finalUser);
    
    // 6. Redirigir
    console.log('🎯 Redirigiendo a /cliente/menu...');
    setTimeout(() => {
      window.location.href = '/cliente/menu';
    }, 100);
    
    return { success: true, user: finalUser };
    
  } catch (error) {
    // ... (mantener el manejo de errores)
  } finally {
    setLoading(false);
  }
};

  // 🔐 Login tradicional
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Login tradicional:', email);
      
      const response = await usuarioService.login({ email, password });
      const { success, data, message } = response.data;
      
      if (!success) {
        throw new Error(message || 'Error en el login');
      }
      
      localStorage.setItem('user', JSON.stringify(data.usuario));
      localStorage.setItem('token', data.token);
      setUser(data.usuario);
      
      // Redirigir según el backend
      const redireccion = data.redireccion || '/cliente/menu';
      setTimeout(() => {
        window.location.href = redireccion;
      }, 100);
      
      return { success: true, user: data.usuario };
      
    } catch (err) {
      console.error('❌ Error en login:', err);
      
      let errorMessage = 'Error al iniciar sesión';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  // 📝 Registro tradicional
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Registro tradicional:', userData.email);
      
      const response = await usuarioService.registro(userData);
      const { success, data, message } = response.data;
      
      if (!success) {
        throw new Error(message || 'Error en el registro');
      }
      
      if (data?.token && data?.usuario) {
        localStorage.setItem('user', JSON.stringify(data.usuario));
        localStorage.setItem('token', data.token);
        setUser(data.usuario);
        
        setTimeout(() => {
          window.location.href = '/cliente/menu';
        }, 100);
      }
      
      return { success: true };
      
    } catch (err) {
      console.error('❌ Error en registro:', err);
      
      let errorMessage = 'Error al registrarse';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Logout
  const logout = async () => {
    try {
      console.log('👋 Cerrando sesión...');
      
      if (auth.currentUser) {
        await firebaseSignOut(auth);
      }
      
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setError(null);
      hasRedirected.current = false; // Resetear flag
      
      console.log('✅ Sesión cerrada');
      window.location.href = '/login';
      
    } catch (error) {
      console.error('❌ Error en logout:', error);
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  // 🔥 MANEJO DE USUARIO FIREBASE - MODIFICADO
const handleFirebaseUser = async (firebaseUser) => {
  console.log('⚠️ handleFirebaseUser llamado');
  
  // Si ya tenemos usuario en estado, no hacer nada
  if (user) {
    console.log('✅ Ya hay usuario en estado, ignorando...');
    return;
  }
  
  // Verificar si ya hay datos en localStorage
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    console.log('✅ Ya hay sesión en localStorage, ignorando...');
    return;
  }
  
  console.log('🔄 Procesando usuario Firebase por primera vez...');
  
  try {
    // Intentar obtener el usuario del backend para asegurar el ID correcto
    let backendUser = null;
    
    try {
      const response = await usuarioService.login({
        email: firebaseUser.email,
        password: 'google-auth'
      });
      
      if (response.data.success) {
        backendUser = response.data.data.usuario;
        console.log('✅ Usuario obtenido del backend:', backendUser);
      }
    } catch (error) {
      console.log('ℹ️ No se pudo obtener usuario del backend, usando datos de Firebase');
    }
    
    // Preparar usuario final
    let finalUser = {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      nombre: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
      foto: firebaseUser.photoURL,
      provider: 'google.com'
    };
    
    // Si tenemos usuario del backend, usarlo
    if (backendUser) {
      finalUser = {
        ...backendUser,
        foto: backendUser.foto || firebaseUser.photoURL,
        provider: 'google.com'
      };
    }
    
    localStorage.setItem('user', JSON.stringify(finalUser));
    localStorage.setItem('token', 'firebase-auto-login');
    setUser(finalUser);
    
    // Solo redirigir si NO estamos ya en /cliente/menu
    if (window.location.pathname !== '/cliente/menu') {
      console.log('🎯 Redirigiendo a /cliente/menu...');
      window.location.href = '/cliente/menu';
    }
    
  } catch (error) {
    console.error('❌ Error en handleFirebaseUser:', error);
  }
};

  const value = {
    user,
    login,
    loginWithGoogle,
    register,
    logout,
    updateUser: (userData) => {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    },
    loading,
    error,
    setError,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'administrador',
    isCliente: user?.rol === 'cliente'
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px'
      }}>
        🔥 Cargando...
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