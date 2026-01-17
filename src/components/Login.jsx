import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../index.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  const navigate = useNavigate();
  const { login, loginWithGoogle, loading, error, setError } = useAuth();

  // Detectar tamaño de pantalla
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

  // Login tradicional
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting || loading) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await login(email, password);
      const redireccion = result.redireccion || localStorage.getItem('redireccion') || '/cliente/menu';
      navigate(redireccion);
      
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  // Login con Google
  const handleGoogleLogin = async () => {
    if (isSubmitting || loading) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await loginWithGoogle();
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  // Login demo
  const handleDemoLogin = async (role = 'admin') => {
    if (isSubmitting || loading) {
      return;
    }

    const demoAccounts = {
      admin: { email: 'admin@restaurant.com', password: 'admin123' },
      mesero: { email: 'mesero@restaurant.com', password: 'mesero123' },
      cocina: { email: 'cocina@restaurant.com', password: 'cocina123' }
    };
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await login(demoAccounts[role].email, demoAccounts[role].password);
      const redireccion = result.redireccion || '/cliente/menu';
      navigate(redireccion);
      
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  // Colores consistentes con MenuPage
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
    warning: '#E74C3C',
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
    },
    googleBlue: '#4285F4',
    googleBlueDark: '#3367D6'
  };

  // Estilos dinámicos
  const styles = {
    container: {
      minHeight: '100vh',
      background: colors.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '16px' : '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    loginCard: {
      backgroundColor: colors.cardBg,
      borderRadius: '0',
      boxShadow: isMobile 
        ? '0 2px 8px rgba(0, 0, 0, 0.1)' 
        : '0 4px 20px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: isMobile ? '100%' : isTablet ? '450px' : '400px',
      padding: isMobile ? '24px 20px' : '32px 28px',
      border: `1px solid ${colors.border}`,
      margin: isMobile ? '0' : '0'
    },
    header: { 
      textAlign: 'center', 
      marginBottom: isMobile ? '24px' : '32px' 
    },
    logoContainer: { 
      display: 'flex', 
      justifyContent: 'center', 
      marginBottom: isMobile ? '12px' : '20px' 
    },
    logoImage: {
      width: isMobile ? '60px' : '80px',
      height: isMobile ? '60px' : '80px',
      objectFit: 'contain'
    },
    logoFallback: {
      width: isMobile ? '60px' : '80px',
      height: isMobile ? '60px' : '80px',
      background: colors.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontSize: isMobile ? '24px' : '32px',
      fontWeight: '700'
    },
    title: {
      fontSize: isMobile ? '24px' : '28px',
      fontWeight: '700',
      color: colors.text.primary,
      margin: '0 0 4px 0'
    },
    subtitle: { 
      fontSize: isMobile ? '14px' : '15px', 
      color: colors.text.light, 
      margin: '0', 
      fontWeight: '400'
    },
    form: { 
      display: 'flex', 
      flexDirection: 'column', 
      gap: isMobile ? '16px' : '20px' 
    },
    errorAlert: {
      backgroundColor: '#FEE2E2',
      border: `1px solid ${colors.warning}`,
      borderRadius: '0',
      padding: isMobile ? '12px' : '14px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px'
    },
    errorIcon: {
      color: colors.warning,
      fontSize: '16px',
      fontWeight: '700',
      flexShrink: 0
    },
    errorText: { 
      color: colors.text.secondary, 
      fontSize: isMobile ? '13px' : '14px', 
      fontWeight: '400',
      lineHeight: 1.4
    },
    inputGroup: { 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '6px' 
    },
    label: { 
      fontSize: isMobile ? '14px' : '15px', 
      fontWeight: '500', 
      color: colors.text.primary 
    },
    inputContainer: { 
      position: 'relative', 
      display: 'flex', 
      alignItems: 'center' 
    },
    input: {
      width: '100%',
      padding: isMobile ? '12px 14px' : '14px 16px',
      border: `1px solid ${colors.border}`,
      borderRadius: '0',
      fontSize: isMobile ? '15px' : '16px',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      backgroundColor: colors.cardBg,
      color: colors.text.primary
    },
    passwordToggle: {
      position: 'absolute',
      right: '12px',
      background: 'none',
      border: 'none',
      fontSize: '16px',
      cursor: 'pointer',
      color: colors.text.light,
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    options: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginTop: '-4px'
    },
    checkboxLabel: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px', 
      fontSize: isMobile ? '13px' : '14px', 
      cursor: 'pointer'
    },
    checkbox: { 
      width: '16px', 
      height: '16px', 
      cursor: 'pointer'
    },
    forgotPassword: {
      background: 'none',
      border: 'none',
      color: colors.secondary,
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '500',
      cursor: 'pointer',
      padding: '0'
    },
    submitButton: {
      width: '100%',
      padding: isMobile ? '14px' : '16px',
      backgroundColor: colors.secondary,
      color: '#ffffff',
      border: 'none',
      borderRadius: '0',
      fontSize: isMobile ? '15px' : '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '8px'
    },
    submitButtonDisabled: { 
      backgroundColor: colors.gray[400], 
      cursor: 'not-allowed',
      opacity: 0.7
    },
    googleButton: {
      width: '100%',
      padding: isMobile ? '14px' : '16px',
      backgroundColor: colors.cardBg,
      color: colors.text.primary,
      border: `1px solid ${colors.border}`,
      borderRadius: '0',
      fontSize: isMobile ? '15px' : '16px',
      fontWeight: '500',
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
      width: isMobile ? '18px' : '20px',
      height: isMobile ? '18px' : '20px'
    },
    demoSection: { 
      marginTop: '32px' 
    },
    divider: { 
      display: 'flex', 
      alignItems: 'center', 
      margin: '20px 0',
      color: colors.gray[400]
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      backgroundColor: colors.border
    },
    dividerText: {
      padding: '0 12px',
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '400',
      color: colors.text.light,
      whiteSpace: 'nowrap'
    },
    demoButtons: { 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr 1fr', 
      gap: isMobile ? '8px' : '10px',
      marginTop: isMobile ? '16px' : '20px'
    },
    demoButton: {
      padding: isMobile ? '10px 8px' : '12px 8px',
      backgroundColor: colors.gray[50],
      border: `1px solid ${colors.border}`,
      borderRadius: '0',
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      color: colors.text.primary
    },
    demoButtonHover: {
      backgroundColor: colors.gray[100],
      borderColor: colors.secondary
    },
    footer: { 
      marginTop: isMobile ? '24px' : '32px', 
      textAlign: 'center', 
      paddingTop: isMobile ? '16px' : '20px', 
      borderTop: `1px solid ${colors.border}` 
    },
    footerText: { 
      fontSize: isMobile ? '12px' : '13px', 
      color: colors.text.light, 
      margin: '0',
      lineHeight: 1.5
    }
  };

  // SVG del logo de Google (sin cambios)
  const GoogleIcon = () => (
    <svg 
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
      <div style={styles.loginCard}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <img 
              src="src\assets\Images\Logos\logo_Blanco.jpg"
              alt="Logo Restaurante"
              style={styles.logoImage}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div style="width: ${isMobile ? '70px' : '90px'}; height: ${isMobile ? '70px' : '90px'}; background: ${colors.primary}; display: flex; align-items: center; justify-content: center; color: white; font-size: ${isMobile ? '24px' : '32px'}; font-weight: 700; border-radius: 0;">
                    R
                  </div>
                `;
              }}
            />
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.errorAlert}>
              <div style={styles.errorIcon}>!</div>
              <span style={styles.errorText}>{error}</span>
            </div>
          )}

          {/* Campo Email */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Correo Electrónico</label>
            <div style={styles.inputContainer}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@restaurant.com"
                required
                disabled={loading || isSubmitting}
                style={styles.input}
                autoComplete="email"
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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
                tabIndex={-1}
              >
                {showPassword ? '👁️' : '👁️'}
              </button>
            </div>
          </div>

          {/* Opciones adicionales */}
          <div style={styles.options}>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                style={styles.checkbox} 
              />
              Recordar sesión
            </label>
            <button 
              type="button" 
              style={styles.forgotPassword}
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
          >
            {loading || isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Botón de Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || isSubmitting}
          style={{
            ...styles.googleButton,
            ...((loading || isSubmitting) ? styles.googleButtonDisabled : {})
          }}
        >
          <GoogleIcon />
          <span>Continuar con Google</span>
        </button>

        

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            El Arte de Cocinar con Precision y Sabor - Al Punto
            <br />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;