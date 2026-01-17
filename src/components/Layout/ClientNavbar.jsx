import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import logoBlanco from '../../assets/Images/Logos/logo_Blanco.jpg';
import { FaBars, FaTimes, FaUser, FaShoppingCart, FaClipboardList } from 'react-icons/fa';

const LightNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    { path: '/cliente/menu', label: 'Menu', icon: <FaShoppingCart /> },
    { path: '/Mis-Pedidos', label: 'Mis Pedidos', icon: <FaClipboardList /> },
    { path: '/Perfil', label: 'Perfil', icon: <FaUser /> }
  ];

  // Detectar cambios en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowMobileMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (isMobile) setShowMobileMenu(false);
  };

  const handleNavClick = () => {
    if (isMobile) setShowMobileMenu(false);
  };

  return (
    <>
      <nav style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        height: isMobile ? '60px' : '70px',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: isMobile ? '0 16px' : '0 32px',
          height: '100%'
        }}>
          
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }} onClick={handleNavClick}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '8px' : '12px'
            }}>
              <img 
                src={logoBlanco} 
                alt="Logo Restaurant" 
                style={{
                  height: isMobile ? '35px' : '45px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
              {!isMobile && (
                <div style={{
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: '700',
                  color: '#111827'
                }}>
                  Restaurante
                </div>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div style={{
              display: 'flex',
              gap: '24px',
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center'
            }}>
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    color: location.pathname === item.path ? '#E74C3C' : '#4b5563',
                    textDecoration: 'none',
                    fontSize: '15px',
                    fontWeight: location.pathname === item.path ? '600' : '500',
                    padding: '8px 0',
                    position: 'relative',
                    transition: 'color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {item.icon}
                  {item.label}
                  {location.pathname === item.path && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-10px',
                      left: 0,
                      right: 0,
                      height: '3px',
                      backgroundColor: '#E74C3C',
                      borderRadius: '2px'
                    }} />
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* User Section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '12px' : '20px'
          }}>
            {/* User Info - Desktop */}
            {!isMobile && (
              <div style={{
                textAlign: 'right'
              }}>
                <div style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  {user?.nombre || 'Usuario'}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#6b7280'
                }}>
                  {user?.rol || 'Administrador'}
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#374151',
                  padding: '8px',
                  fontSize: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px'
                }}
              >
                {showMobileMenu ? <FaTimes /> : <FaBars />}
              </button>
            )}

            {/* Logout Button - Desktop */}
            {!isMobile && (
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minWidth: '80px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.backgroundColor = '#f3f4f6';
                  e.currentTarget.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.backgroundColor = 'transparent';
                  e.currentTarget.borderColor = '#d1d5db';
                }}
              >
                Salir
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobile && showMobileMenu && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          animation: 'fadeIn 0.3s ease'
        }}
        onClick={() => setShowMobileMenu(false)}
        >
          {/* Mobile Menu Panel */}
          <div style={{
            position: 'fixed',
            top: '60px',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            zIndex: 1000,
            animation: 'slideDown 0.3s ease',
            maxHeight: 'calc(100vh - 60px)',
            overflowY: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* User Info - Mobile */}
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#E74C3C',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: '600'
                }}>
                  {user?.nombre?.charAt(0) || 'U'}
                </div>
                <div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#111827'
                  }}>
                    {user?.nombre || 'Usuario'}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#6b7280'
                  }}>
                    {user?.rol || 'Administrador'}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Items */}
            <div style={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  style={{
                    color: location.pathname === item.path ? '#E74C3C' : '#374151',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: location.pathname === item.path ? '600' : '500',
                    padding: '16px 20px',
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: location.pathname === item.path ? '#eff6ff' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!location.pathname === item.path) {
                      e.currentTarget.backgroundColor = '#f9fafb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!location.pathname === item.path) {
                      e.currentTarget.backgroundColor = '#ffffff';
                    }
                  }}
                >
                  <div style={{
                    color: location.pathname === item.path ? '#E74C3C' : '#6b7280',
                    fontSize: '18px'
                  }}>
                    {item.icon}
                  </div>
                  {item.label}
                </Link>
              ))}

              {/* Logout Button - Mobile */}
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderTop: '1px solid #e5e7eb',
                  color: '#dc2626',
                  padding: '16px 20px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.backgroundColor = '#fef2f2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.backgroundColor = 'transparent';
                }}
              >
                <div style={{ fontSize: '18px' }}>🚪</div>
                Cerrar Sesión
              </button>
            </div>

            {/* Mobile Footer */}
            <div style={{
              padding: '20px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              textAlign: 'center',
              fontSize: '12px',
              color: '#6b7280'
            }}>
              <div style={{ marginBottom: '8px' }}>Restaurante - Sabor Auténtico</div>
              <div>© {new Date().getFullYear()} Todos los derechos reservados</div>
            </div>
          </div>
        </div>
      )}

      {/* Add animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideDown {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </>
  );
};

export default LightNavbar;