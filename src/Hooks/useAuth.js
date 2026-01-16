// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../services/firebase.js'; // Asegúrate de tener este archivo
import { usuarioService } from '../services/api.js';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [firebaseLoading, setFirebaseLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);

  // Provider de Google
  const googleProvider = new GoogleAuthProvider();

  // Configurar observador de Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔥 [Firebase Auth State Changed]:', firebaseUser);
      setFirebaseUser(firebaseUser);
      setFirebaseLoading(false);

      // Si hay usuario de Firebase pero no en nuestro sistema, sincronizar
      if (firebaseUser && !user) {
        await syncUserWithBackend(firebaseUser);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔄 Sincronizar usuario de Firebase con nuestro backend
  const syncUserWithBackend = async (firebaseUser) => {
    try {
      console.log('🔄 [useAuth] Sincronizando usuario Firebase con backend...');
      
      // Obtener token de Firebase
      const firebaseToken = await firebaseUser.getIdToken();
      
      // Datos del usuario de Firebase
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        nombre: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        foto: firebaseUser.photoURL,
        provider: firebaseUser.providerData[0]?.providerId || 'google.com',
        emailVerified: firebaseUser.emailVerified,
        phoneNumber: firebaseUser.phoneNumber,
        firebaseToken: firebaseToken
      };

      console.log('📤 [useAuth] Datos a sincronizar:', userData);

      // Intentar sincronizar con backend
      const response = await usuarioService.syncFirebaseUser(userData);
      const { success, data, message } = response.data;

      if (success) {
        console.log('✅ [useAuth] Usuario sincronizado con backend:', data);
        
        // Guardar en localStorage
        localStorage.setItem('token', data.token || firebaseToken);
        localStorage.setItem('user', JSON.stringify(data.usuario || userData));
        setUser(data.usuario || userData);
        
        // Redirigir si es necesario
        if (data.redireccion) {
          localStorage.setItem('redireccion', data.redireccion);
          setTimeout(() => {
            window.location.href = data.redireccion;
          }, 500);
        }
      } else {
        console.warn('⚠️ [useAuth] Sincronización no exitosa:', message);
        // Guardar datos básicos de Firebase
        localStorage.setItem('firebase_user', JSON.stringify(userData));
      }
    } catch (err) {
      console.error('❌ [useAuth] Error sincronizando con backend:', err);
    }
  };

  // 🔐 Iniciar sesión con Google
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 [useAuth] Iniciando sesión con Google...');
      
      // Autenticación con Google mediante Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      console.log('✅ [useAuth] Firebase auth exitosa:', firebaseUser.email);
      
      // Sincronizar con backend
      await syncUserWithBackend(firebaseUser);
      
      return { success: true, user: firebaseUser };
      
    } catch (err) {
      console.error('❌ [useAuth] Error en login con Google:', err);
      
      let errorMessage = 'Error al iniciar sesión con Google';
      
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'El popup de Google fue cerrado';
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = 'El popup fue bloqueado. Permite ventanas emergentes';
      } else if (err.code) {
        errorMessage = `Error de Firebase: ${err.code}`;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  // 📝 Login tradicional con email/password
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 [useAuth] Iniciando login tradicional:', { email });
      
      // Opción 1: Usar Firebase directamente
      // const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // await syncUserWithBackend(userCredential.user);
      
      // Opción 2: Usar tu backend actual (recomendado para mantener consistencia)
      const response = await usuarioService.login({ email, password });
      const { success, data, message } = response.data;
      
      if (!success) {
        throw new Error(message || 'Error en el login');
      }
      
      // Verificar estructura de respuesta
      if (!data?.token || !data?.usuario) {
        throw new Error('Respuesta inválida del servidor');
      }
      
      // Guardar en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      if (data.redireccion) {
        localStorage.setItem('redireccion', data.redireccion);
      }
      
      setUser(data.usuario);
      
      console.log('✅ [useAuth] Login tradicional exitoso');
      
      // Redirigir
      setTimeout(() => {
        const rutaDestino = data.redireccion || '/dashboard';
        window.location.href = rutaDestino;
      }, 500);
      
      return data;
      
    } catch (err) {
      console.error('❌ [useAuth] Error en login tradicional:', err);
      
      let errorMessage = 'Error al iniciar sesión';
      
      if (err.response) {
        errorMessage = err.response.data?.error || 
                      err.response.data?.message || 
                      `Error del servidor: ${err.response.status}`;
      } else if (err.code) {
        // Error de Firebase
        if (err.code === 'auth/user-not-found') {
          errorMessage = 'Usuario no encontrado';
        } else if (err.code === 'auth/wrong-password') {
          errorMessage = 'Contraseña incorrecta';
        } else if (err.code === 'auth/invalid-email') {
          errorMessage = 'Email inválido';
        }
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  // 📋 Registro con Firebase + Backend
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 [useAuth] Iniciando registro:', userData.email);
      
      // 1. Crear usuario en Firebase
      const firebaseResponse = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      console.log('✅ [useAuth] Usuario creado en Firebase:', firebaseResponse.user.uid);
      
      // 2. Preparar datos para backend
      const completeUserData = {
        ...userData,
        uid: firebaseResponse.user.uid,
        emailVerified: false,
        provider: 'email/password',
        firebaseToken: await firebaseResponse.user.getIdToken()
      };
      
      // 3. Guardar en backend
      const backendResponse = await usuarioService.registro(completeUserData);
      const { success, data, message } = backendResponse.data;
      
      if (!success) {
        // Si falla el backend, eliminar usuario de Firebase
        await firebaseResponse.user.delete();
        throw new Error(message || 'Error en el registro');
      }
      
      // 4. Sincronizar y guardar
      await syncUserWithBackend(firebaseResponse.user);
      
      return data;
      
    } catch (err) {
      console.error('❌ [useAuth] Error en registro:', err);
      
      let errorMessage = 'Error al registrarse';
      
      if (err.code) {
        // Errores de Firebase
        if (err.code === 'auth/email-already-in-use') {
          errorMessage = 'El email ya está registrado';
        } else if (err.code === 'auth/weak-password') {
          errorMessage = 'La contraseña es muy débil';
        } else if (err.code === 'auth/invalid-email') {
          errorMessage = 'Email inválido';
        }
      } else if (err.response) {
        errorMessage = err.response.data?.error || 'Error en el registro';
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Logout (ambos sistemas)
  const logout = async () => {
    try {
      console.log('👋 [useAuth] Cerrando sesión...');
      
      // 1. Cerrar sesión en Firebase
      if (auth.currentUser) {
        await firebaseSignOut(auth);
      }
      
      // 2. Limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('redireccion');
      localStorage.removeItem('firebase_user');
      
      // 3. Limpiar estado
      setUser(null);
      setFirebaseUser(null);
      setError(null);
      
      console.log('✅ [useAuth] Sesión cerrada en ambos sistemas');
      
      // 4. Redirigir a login
      window.location.href = '/login';
      
    } catch (err) {
      console.error('❌ [useAuth] Error en logout:', err);
      // Forzar limpieza
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  // 🔍 Verificar autenticación
  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      const firebaseUserData = localStorage.getItem('firebase_user');
      
      // Priorizar usuario del backend
      if (token && userData) {
        const user = JSON.parse(userData);
        setUser(user);
        return { isAuthenticated: true, user, source: 'backend' };
      }
      
      // Fallback a Firebase
      if (firebaseUserData) {
        const user = JSON.parse(firebaseUserData);
        setUser(user);
        return { isAuthenticated: true, user, source: 'firebase' };
      }
      
      return { isAuthenticated: false };
      
    } catch (err) {
      console.error('❌ [useAuth] Error verificando autenticación:', err);
      return { isAuthenticated: false };
    }
  };

  // 👤 Obtener usuario actual
  const getCurrentUser = () => {
    if (user) return user;
    
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        return parsedUser;
      }
      
      const firebaseData = localStorage.getItem('firebase_user');
      if (firebaseData) {
        const parsedUser = JSON.parse(firebaseData);
        setUser(parsedUser);
        return parsedUser;
      }
    } catch (err) {
      console.error('❌ [useAuth] Error obteniendo usuario:', err);
    }
    
    return null;
  };

  // 🔄 Actualizar datos del usuario
  const updateUser = async (userData) => {
    try {
      // Actualizar en localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Si hay usuario de Firebase, actualizar perfil
      if (auth.currentUser && userData.nombre) {
        await updateProfile(auth.currentUser, {
          displayName: userData.nombre,
          photoURL: userData.foto
        });
      }
    } catch (err) {
      console.error('❌ [useAuth] Error actualizando usuario:', err);
    }
  };

  // 🔑 Obtener token actual
  const getCurrentToken = async () => {
    try {
      // Priorizar token del backend
      const backendToken = localStorage.getItem('token');
      if (backendToken) return backendToken;
      
      // Fallback a token de Firebase
      if (auth.currentUser) {
        return await auth.currentUser.getIdToken();
      }
      
      return null;
    } catch (err) {
      console.error('❌ [useAuth] Error obteniendo token:', err);
      return null;
    }
  };

  return { 
    // Métodos de autenticación
    login, 
    register, 
    loginWithGoogle,
    logout, 
    
    // Métodos de verificación
    checkAuth, 
    getCurrentUser,
    getCurrentToken,
    getRedireccion: () => localStorage.getItem('redireccion') || '/dashboard',
    updateUser,
    
    // Estados
    user,
    firebaseUser,
    loading,
    firebaseLoading,
    error,
    setError
  };
};