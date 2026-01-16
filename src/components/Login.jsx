import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../index.css'; // Importar el archivo CSS separado

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [debugInfo, setDebugInfo] = useState([]);
  const [showDebug, setShowDebug] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  const navigate = useNavigate();
  const { login, loginWithGoogle, loading, error, setError } = useAuth();

  // 📱 Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenSize.width < 768;
  const isTablet = screenSize.width >= 768 && screenSize.width < 1024;

  // 🔍 Función para agregar logs de debug
  const addDebugLog = (message, data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      time: timestamp,
      message,
      data: data ? JSON.stringify(data, null, 2) : null
    };
    setDebugInfo(prev => [...prev, logEntry]);
    console.log(`[${timestamp}] ${message}`, data || '');
  };

  // 🔐 Login tradicional
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting || loading) {
      addDebugLog('⚠️ Submit bloqueado - Ya hay una petición en curso');
      return;
    }
    
    setIsSubmitting(true);
    setDebugInfo([]);
    setError(null);
    
    try {
      addDebugLog('🚀 Iniciando login...', { email });
      
      const result = await login(email, password);
      
      addDebugLog('✅ Login exitoso', result);
      
      const redireccion = result.redireccion || localStorage.getItem('redireccion') || '/cliente/menu';
      
      addDebugLog('🎯 Redirigiendo a:', redireccion);
      
      navigate(redireccion);
      
    } catch (err) {
      addDebugLog('❌ Error en login', {
        message: err.message,
        response: err.response?.data
      });
      setIsSubmitting(false);
    }
  };

  // 🔵 Login con Google
  const handleGoogleLogin = async () => {
    if (isSubmitting || loading) {
      addDebugLog('⚠️ Google login bloqueado - Ya hay una petición en curso');
      return;
    }
    
    setIsSubmitting(true);
    setDebugInfo([]);
    setError(null);
    
    try {
      addDebugLog('🚀 Iniciando login con Google...');
      
      const result = await loginWithGoogle();
      
      addDebugLog('✅ Login Google exitoso', result);
      
    } catch (err) {
      addDebugLog('❌ Error en login Google', {
        message: err.message
      });
      setIsSubmitting(false);
    }
  };

  // 🎭 Login demo
  const handleDemoLogin = async (role = 'admin') => {
    if (isSubmitting || loading) {
      return;
    }

    const demoAccounts = {
      admin: { email: 'admin@restaurant.com', password: 'admin123' },
      mesero: { email: 'mesero@restaurant.com', password: 'mesero123' },
      cocina: { email: 'cocina@restaurant.com', password: 'cocina123' }
    };
    
    addDebugLog(`🎭 Cuenta demo seleccionada: ${role}`);
    
    setIsSubmitting(true);
    setDebugInfo([]);
    setError(null);
    
    try {
      const result = await login(demoAccounts[role].email, demoAccounts[role].password);
      
      addDebugLog('✅ Login demo exitoso', result);
      
      const redireccion = result.redireccion || '/cliente/menu';
      addDebugLog('🎯 Redirigiendo a:', redireccion);
      
      navigate(redireccion);
      
    } catch (err) {
      addDebugLog('❌ Error en login demo', {
        message: err.message,
        response: err.response?.data
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🎨 Colores
  const colors = {
    primary: { 
      red: '#E74C3C', 
      redDark: '#C0392B', 
      orange: '#F39C12', 
      black: '#2C3E50',
      googleBlue: '#4285F4',
      googleBlueDark: '#3367D6'
    },
    neutral: { 
      white: '#FFFFFF', 
      black: '#1A1A1A', 
      gray: '#95A5A6', 
      lightGray: '#ECF0F1',
      border: '#DDDDDD'
    },
    bg: { 
      light: '#FFF5F0', 
      cream: '#FDF6E3',
      googleHover: '#F8F8F8'
    }
  };

  // 📱 Estilos dinámicos basados en tamaño de pantalla
  const styles = {
    container: {
      minHeight: '100vh',
      background: isMobile 
        ? colors.neutral.white 
        : `linear-gradient(135deg, ${colors.bg.light} 0%, ${colors.bg.cream} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '16px' : '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      position: 'relative',
      overflow: 'auto'
    },
    loginCard: {
      backgroundColor: colors.neutral.white,
      borderRadius: isMobile ? '12px' : '16px',
      boxShadow: isMobile 
        ? '0 4px 20px rgba(0, 0, 0, 0.1)' 
        : '0 10px 40px rgba(231, 76, 60, 0.15)',
      width: '100%',
      maxWidth: isMobile ? '100%' : isTablet ? '500px' : '440px',
      padding: isMobile ? '32px 24px' : isTablet ? '40px 32px' : '48px 40px',
      border: isMobile ? '1px solid #eee' : `2px solid ${colors.primary.red}20`,
      margin: isMobile ? '16px' : '0'
    },
    header: { 
      textAlign: 'center', 
      marginBottom: isMobile ? '32px' : '40px' 
    },
    logo: { 
      display: 'flex', 
      justifyContent: 'center', 
      marginBottom: isMobile ? '16px' : '24px' 
    },
    logoIcon: { 
      position: 'relative', 
      display: 'inline-block' 
    },
    logoText: {
      fontSize: isMobile ? '28px' : '36px',
      fontWeight: '900',
      color: colors.primary.black,
      fontFamily: '"Brush Script MT", cursive, "Segoe UI", sans-serif',
      letterSpacing: '1px'
    },
    flame: { 
      position: 'absolute', 
      top: isMobile ? '-6px' : '-8px', 
      right: isMobile ? '-16px' : '-20px', 
      fontSize: isMobile ? '24px' : '32px' 
    },
    title: {
      fontSize: isMobile ? '24px' : '32px',
      fontWeight: '900',
      background: `linear-gradient(135deg, ${colors.primary.red} 0%, ${colors.primary.orange} 100%)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: '0 0 8px 0',
      fontFamily: '"Brush Script MT", cursive, "Segoe UI", sans-serif'
    },
    subtitle: { 
      fontSize: isMobile ? '13px' : '15px', 
      color: colors.primary.black, 
      margin: '0', 
      fontWeight: '500', 
      opacity: 0.8 
    },
    form: { 
      display: 'flex', 
      flexDirection: 'column', 
      gap: isMobile ? '20px' : '24px' 
    },
    errorAlert: {
      backgroundColor: '#FEE2E2',
      border: `2px solid ${colors.primary.red}`,
      borderRadius: '8px',
      padding: isMobile ? '12px' : '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    errorIcon: {
      width: isMobile ? '20px' : '24px',
      height: isMobile ? '20px' : '24px',
      backgroundColor: colors.primary.red,
      color: colors.neutral.white,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: '700',
      flexShrink: 0
    },
    errorText: { 
      color: colors.primary.redDark, 
      fontSize: isMobile ? '13px' : '14px', 
      fontWeight: '500',
      lineHeight: 1.4
    },
    debugButton: {
      padding: isMobile ? '10px' : '12px',
      backgroundColor: '#F0F0F0',
      border: '2px solid #DDD',
      borderRadius: '8px',
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      width: '100%'
    },
    inputGroup: { 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '8px' 
    },
    label: { 
      fontSize: isMobile ? '13px' : '14px', 
      fontWeight: '600', 
      color: colors.primary.black 
    },
    inputContainer: { 
      position: 'relative', 
      display: 'flex', 
      alignItems: 'center' 
    },
    input: {
      width: '100%',
      padding: isMobile ? '12px 14px' : '14px 16px',
      border: `2px solid ${colors.neutral.lightGray}`,
      borderRadius: '8px',
      fontSize: isMobile ? '14px' : '15px',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      backgroundColor: colors.neutral.white,
      color: colors.neutral.black
    },
    passwordToggle: {
      position: 'absolute',
      right: '12px',
      background: 'none',
      border: 'none',
      fontSize: isMobile ? '16px' : '18px',
      cursor: 'pointer',
      color: colors.neutral.gray,
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    options: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginTop: '-4px',
      flexWrap: isMobile ? 'wrap' : 'nowrap',
      gap: isMobile ? '8px' : '0'
    },
    checkboxLabel: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px', 
      fontSize: isMobile ? '13px' : '14px', 
      cursor: 'pointer',
      whiteSpace: 'nowrap'
    },
    checkbox: { 
      width: '18px', 
      height: '18px', 
      cursor: 'pointer', 
      accentColor: colors.primary.red 
    },
    forgotPassword: {
      background: 'none',
      border: 'none',
      color: colors.primary.red,
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '600',
      cursor: 'pointer',
      textAlign: isMobile ? 'left' : 'right',
      padding: '4px 0'
    },
    submitButton: {
      width: '100%',
      padding: isMobile ? '14px' : '16px',
      backgroundColor: colors.primary.red,
      color: colors.neutral.white,
      border: 'none',
      borderRadius: '8px',
      fontSize: isMobile ? '15px' : '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    submitButtonDisabled: { 
      backgroundColor: colors.neutral.gray, 
      cursor: 'not-allowed', 
      boxShadow: 'none',
      opacity: 0.7
    },
    
    // 🔵 Botón de Google
    googleButton: {
      width: '100%',
      padding: isMobile ? '14px' : '16px',
      backgroundColor: colors.neutral.white,
      color: colors.neutral.black,
      border: `2px solid ${colors.neutral.border}`,
      borderRadius: '8px',
      fontSize: isMobile ? '15px' : '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginTop: isMobile ? '12px' : '16px'
    },
    googleButtonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    googleIcon: {
      width: isMobile ? '20px' : '24px',
      height: isMobile ? '20px' : '24px'
    },
    
    demoSection: { 
      marginTop: '40px' 
    },
    divider: { 
      display: 'flex', 
      alignItems: 'center', 
      margin: '24px 0',
      color: colors.neutral.gray
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      backgroundColor: colors.neutral.lightGray
    },
    dividerText: {
      padding: '0 16px',
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '500',
      color: colors.neutral.gray,
      whiteSpace: 'nowrap'
    },
    demoButtons: { 
      display: 'grid', 
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', 
      gap: isMobile ? '10px' : '12px',
      marginTop: isMobile ? '16px' : '20px'
    },
    demoButton: {
      padding: isMobile ? '12px' : '12px 8px',
      backgroundColor: colors.bg.light,
      border: `2px solid ${colors.primary.orange}40`,
      borderRadius: '8px',
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    footer: { 
      marginTop: isMobile ? '24px' : '32px', 
      textAlign: 'center', 
      paddingTop: isMobile ? '16px' : '24px', 
      borderTop: `1px solid ${colors.neutral.lightGray}` 
    },
    footerText: { 
      fontSize: isMobile ? '12px' : '13px', 
      color: colors.neutral.gray, 
      margin: '0',
      lineHeight: 1.5
    },
    
    // 🐛 Panel Debug (responsive)
    debugPanel: {
      position: isMobile ? 'fixed' : 'absolute',
      top: isMobile ? '0' : '20px',
      right: isMobile ? '0' : '20px',
      width: isMobile ? '100%' : '400px',
      height: isMobile ? '100vh' : 'auto',
      maxHeight: isMobile ? '100vh' : '80vh',
      backgroundColor: '#1E1E1E',
      borderRadius: isMobile ? '0' : '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      zIndex: 1000,
      overflow: 'hidden',
      border: '2px solid #333',
      transform: isMobile ? (showDebug ? 'translateX(0)' : 'translateX(100%)') : 'none',
      transition: 'transform 0.3s ease'
    },
    debugHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: isMobile ? '12px 16px' : '16px',
      backgroundColor: '#2D2D2D',
      borderBottom: '1px solid #404040'
    },
    debugTitle: { 
      margin: 0, 
      fontSize: isMobile ? '14px' : '16px', 
      fontWeight: '700', 
      color: '#FFF' 
    },
    debugClose: { 
      background: 'none', 
      border: 'none', 
      color: '#999', 
      fontSize: isMobile ? '18px' : '20px', 
      cursor: 'pointer', 
      padding: '4px 8px' 
    },
    debugContent: {
      padding: isMobile ? '12px' : '16px',
      maxHeight: isMobile ? 'calc(100vh - 45px)' : 'calc(80vh - 60px)',
      overflowY: 'auto',
      fontSize: isMobile ? '12px' : '13px',
      fontFamily: 'Monaco, Consolas, monospace'
    },
    debugLog: { 
      marginBottom: isMobile ? '12px' : '16px', 
      paddingBottom: isMobile ? '12px' : '16px', 
      borderBottom: '1px solid #333' 
    },
    debugTime: { 
      color: '#888', 
      fontSize: isMobile ? '10px' : '11px', 
      display: 'block', 
      marginBottom: '4px' 
    },
    debugMessage: { 
      color: '#FFF', 
      display: 'block', 
      marginBottom: '8px',
      wordBreak: 'break-word' 
    },
    debugData: {
      backgroundColor: '#0D0D0D',
      padding: isMobile ? '8px' : '12px',
      borderRadius: '4px',
      color: '#4EC9B0',
      fontSize: isMobile ? '10px' : '11px',
      overflowX: 'auto',
      margin: 0
    },
    
    // 📱 Botón flotante para debug en móvil
    debugMobileButton: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: '#333',
      color: '#FFF',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 999,
      display: isMobile ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center'
    }
  };

  // SVG del logo de Google
  const GoogleIcon = () => (
    <svg 
      className="google-icon" 
      viewBox="0 0 24 24" 
      style={styles.googleIcon}
    >
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );

  return (
    <div style={styles.container}>
      {/* 🐛 Botón flotante para debug en móvil */}
      {isMobile && debugInfo.length > 0 && (
        <button
          type="button"
          onClick={() => setShowDebug(!showDebug)}
          style={styles.debugMobileButton}
        >
          🐛
        </button>
      )}

      {/* 🐛 Panel de Debug */}
      {debugInfo.length > 0 && (
        <div style={styles.debugPanel}>
          <div style={styles.debugHeader}>
            <h3 style={styles.debugTitle}>🐛 Debug Console ({debugInfo.length})</h3>
            <button 
              onClick={() => setShowDebug(false)}
              style={styles.debugClose}
              aria-label="Cerrar debug"
            >
              ✕
            </button>
          </div>
          <div style={styles.debugContent}>
            {debugInfo.map((log, index) => (
              <div key={index} style={styles.debugLog}>
                <span style={styles.debugTime}>[{log.time}]</span>
                <span style={styles.debugMessage}>{log.message}</span>
                {log.data && (
                  <pre style={styles.debugData}>{log.data}</pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={styles.loginCard}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <span style={styles.logoText}>Alpunto</span>
              <div style={styles.flame}>🔥</div>
            </div>
          </div>
          <h1 style={styles.title}>Alpunto</h1>
          <p style={styles.subtitle}>Sistema de Gestión de Comandas</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.errorAlert}>
              <div style={styles.errorIcon}>!</div>
              <span style={styles.errorText}>{error}</span>
            </div>
          )}

          {/* 🐛 Botón para mostrar debug (solo en desktop) */}
          {!isMobile && debugInfo.length > 0 && (
            <button
              type="button"
              onClick={() => setShowDebug(!showDebug)}
              style={styles.debugButton}
            >
              {showDebug ? '🐛 Ocultar Debug' : `🐛 Ver Debug (${debugInfo.length})`}
            </button>
          )}

          {/* Campo Email */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Correo Electrónico</label>
            <div style={styles.inputContainer}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@alpunto.com"
                required
                disabled={loading || isSubmitting}
                style={styles.input}
                autoComplete="email"
                aria-label="Correo electrónico"
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña</label>
            <div style={styles.inputContainer}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading || isSubmitting}
                style={styles.input}
                autoComplete="current-password"
                aria-label="Contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
                tabIndex={-1}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Opciones adicionales */}
          <div style={styles.options}>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                style={styles.checkbox} 
                aria-label="Recordar sesión"
              />
              Recordar sesión
            </label>
            <button 
              type="button" 
              style={styles.forgotPassword}
              aria-label="¿Olvidaste tu contraseña?"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Botón de Login Tradicional */}
          <button
            type="submit"
            disabled={loading || isSubmitting}
            style={{
              ...styles.submitButton,
              ...((loading || isSubmitting) ? styles.submitButtonDisabled : {})
            }}
            aria-label="Iniciar sesión"
          >
            {(loading || isSubmitting) ? (
              <>
                <span>⏳</span>
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <>
                <span>🔥</span>
                <span>Iniciar Sesión</span>
              </>
            )}
          </button>
        </form>

        {/* 🔵 Botón de Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || isSubmitting}
          style={{
            ...styles.googleButton,
            ...((loading || isSubmitting) ? styles.googleButtonDisabled : {})
          }}
          aria-label="Continuar con Google"
          className="google-login-btn"
        >
          <GoogleIcon />
          <span>Continuar con Google</span>
        </button>

        {/* Cuentas de demostración */}
        <div style={styles.demoSection}>
          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>O prueba con</span>
            <div style={styles.dividerLine}></div>
          </div>
          <div style={styles.demoButtons}>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              disabled={loading || isSubmitting}
              style={styles.demoButton}
              aria-label="Login como administrador demo"
              className="demo-btn"
            >
              <span>👨‍💼</span>
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('mesero')}
              disabled={loading || isSubmitting}
              style={styles.demoButton}
              aria-label="Login como mesero demo"
              className="demo-btn"
            >
              <span>🍽️</span>
              <span>Mesero</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('cocina')}
              disabled={loading || isSubmitting}
              style={styles.demoButton}
              aria-label="Login como cocina demo"
              className="demo-btn"
            >
              <span>👨‍🍳</span>
              <span>Cocina</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            © 2024 Alpunto 🔥 · Sistema de Gestión de Comandas
            <br />
            {isMobile && <span style={{ fontSize: '11px', opacity: 0.7 }}>Versión móvil</span>}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;