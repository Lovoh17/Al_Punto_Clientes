// src/components/Layout/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from './Navbar';
import ClientNavbar from './ClientNavbar';

const Layout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      { <ClientNavbar />}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;