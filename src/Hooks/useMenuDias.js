// src/hooks/useMenuDias.js
import { useState, useEffect } from 'react';
import { menuDiasService, menuDiasProductosService, categoriaService } from '../services/api';

export const useMenuDias = () => {
  const [menus, setMenus] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await menuDiasService.getAll();
      console.log('📦 Respuesta de API MenuDias:', response.data);
      
      // Manejar diferentes estructuras de respuesta
      let menusData = [];
      if (response.data && response.data.data) {
        menusData = Array.isArray(response.data.data) ? response.data.data : [];
      } else if (Array.isArray(response.data)) {
        menusData = response.data;
      }
      
      console.log('✅ Menús procesados:', menusData);
      setMenus(menusData);
    } catch (err) {
      console.error('❌ Error en fetchMenus:', err);
      setError(err.response?.data?.message || 'Error al cargar menús');
      setMenus([]); // Asegurar que siempre sea un array
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await categoriaService.getAll();
      let categoriasData = [];
      
      if (response.data && response.data.data) {
        categoriasData = Array.isArray(response.data.data) ? response.data.data : [];
      } else if (Array.isArray(response.data)) {
        categoriasData = response.data;
      }
      
      setCategorias(categoriasData);
    } catch (err) {
      console.error('Error cargando categorías:', err);
      setCategorias([]);
    }
  };

  const getMenuHoy = async () => {
    try {
      const response = await menuDiasService.getHoy();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Error' };
    }
  };

  const getMenuProximos = async () => {
    try {
      const response = await menuDiasService.getProximos();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Error' };
    }
  };

  const crearMenu = async (menuData) => {
    try {
      const response = await menuDiasService.create(menuData);
      await fetchMenus();
      return { success: true, data: response.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error al crear menú' 
      };
    }
  };

  const actualizarMenu = async (id, menuData) => {
    try {
      const response = await menuDiasService.update(id, menuData);
      await fetchMenus();
      return { success: true, data: response.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error al actualizar menú' 
      };
    }
  };

  const eliminarMenu = async (id) => {
    try {
      await menuDiasService.delete(id);
      await fetchMenus();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error al eliminar menú' 
      };
    }
  };

  const getProductosMenu = async (menuId) => {
    try {
      const response = await menuDiasProductosService.getProductosPorMenu(menuId);
      console.log('📦 Respuesta productos del menú:', response.data);
      
      let productosData = [];
      if (response.data && response.data.data) {
        productosData = Array.isArray(response.data.data) ? response.data.data : [];
      } else if (Array.isArray(response.data)) {
        productosData = response.data;
      }
      
      return { success: true, data: productosData };
    } catch (err) {
      console.error('Error en getProductosMenu:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error al cargar productos' 
      };
    }
  };

  const agregarProductosMenu = async (menuId, productos) => {
    try {
      const response = await menuDiasProductosService.agregarMultiples(menuId, productos);
      return { success: true, data: response.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error al agregar productos' 
      };
    }
  };

  const cambiarDisponibilidadProducto = async (itemId, disponible) => {
    try {
      const response = await menuDiasProductosService.cambiarDisponibilidad(itemId, disponible);
      return { success: true, data: response.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error al cambiar disponibilidad' 
      };
    }
  };

  const eliminarProductoMenu = async (itemId) => {
    try {
      await menuDiasProductosService.eliminarProducto(itemId);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error al eliminar producto' 
      };
    }
  };

  const getEstadisticasMenu = async (menuId) => {
    try {
      const response = await menuDiasProductosService.getEstadisticas(menuId);
      return { success: true, data: response.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error al cargar estadísticas' 
      };
    }
  };

  const copiarMenu = async (menuId, datosCopia) => {
    try {
      const response = await menuDiasProductosService.copiarMenu(menuId, datosCopia);
      await fetchMenus();
      return { success: true, data: response.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error al copiar menú' 
      };
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      await Promise.all([
        fetchMenus(),
        fetchCategorias()
      ]);
    };
    
    cargarDatos();
  }, []);

  return {
    menus,
    categorias,
    loading,
    error,
    refetch: fetchMenus,
    getMenuHoy,
    getMenuProximos,
    crearMenu,
    actualizarMenu,
    eliminarMenu,
    getProductosMenu,
    agregarProductosMenu,
    cambiarDisponibilidadProducto,
    eliminarProductoMenu,
    getEstadisticasMenu,
    copiarMenu
  };
};