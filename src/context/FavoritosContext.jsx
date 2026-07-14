// src/context/FavoritosContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../config/supabase';
import { safeLocalStorage } from '../utils/safeLocalStorage';
import { useAuth } from './AuthContext'; // <-- Inyectamos la nube de autenticación

const FavoritosContext = createContext();

export function FavoritosProvider({ children }) {
  const { user } = useAuth();
  const [favoritos, setFavoritos] = useState([]);

  // 1. Efecto inicial y reactivo al cambio de usuario
  useEffect(() => {
    if (user) {
      // Si hay usuario logueado, leemos de la base de datos
      fetchFavoritosNube();
    } else {
      // Si no hay usuario, cargamos del almacenamiento local
      const favsLocales = safeLocalStorage.getItem('rinn_favoritos', []);
      setFavoritos(favsLocales);
    }
  }, [user]);

  // 2. Efecto para respaldar en local (solo si no hay sesión iniciada)
  useEffect(() => {
    if (!user) {
      safeLocalStorage.setItem('rinn_favoritos', favoritos);
    }
  }, [favoritos, user]);

  // 3. Función para traer datos cruzados (Favoritos + Repuestos + Inventario)
  const fetchFavoritosNube = async () => {
    try {
      const { data, error } = await supabase
        .from('favoritos_usuarios')
        .select(`
          repuesto_id,
          repuestos (
            id, sku, nombre,
            inventario_tienda (precio_usd, stock)
          )
        `)
        .eq('usuario_id', user.id);

      if (error) throw error;

      // Formateamos los datos para que la tarjeta (RepuestoCard) los entienda igual que siempre
      const favsFormateados = data.map(item => ({
        id: item.repuestos.id,
        sku: item.repuestos.sku,
        nombre: item.repuestos.nombre,
        precio: item.repuestos.inventario_tienda[0]?.precio_usd || "0.00",
        stock: item.repuestos.inventario_tienda[0]?.stock || 0
      }));
      
      setFavoritos(favsFormateados);
    } catch (error) {
      console.error("Error al cargar los favoritos de la nube:", error);
    }
  };

  // 4. Lógica de negocio para agregar/quitar
  const toggleFavorito = async (repuesto) => {
    const existe = favoritos.find((item) => item.id === repuesto.id);
    
    // A) Actualización Optimista (La interfaz cambia instantáneamente)
    if (existe) {
      setFavoritos((prev) => prev.filter((item) => item.id !== repuesto.id));
    } else {
      setFavoritos((prev) => [...prev, repuesto]);
    }

    // B) Lógica de persistencia en la nube
    if (user) {
      try {
        if (existe) {
          // Si ya existía, lo eliminamos de Supabase
          const { error } = await supabase
            .from('favoritos_usuarios')
            .delete()
            .eq('usuario_id', user.id)
            .eq('repuesto_id', repuesto.id);
            
          if (error) throw error;
        } else {
          // Si no existía, lo insertamos en Supabase
          const { error } = await supabase
            .from('favoritos_usuarios')
            .insert({ usuario_id: user.id, repuesto_id: repuesto.id });
            
          if (error) throw error;
        }
      } catch (error) {
        console.error("Error sincronizando con la base de datos:", error);
        // Si la base de datos falla, revertimos el estado visual a la verdad del servidor
        fetchFavoritosNube(); 
      }
    }
  };

  const isFavorito = (id) => {
    return favoritos.some((item) => item.id === id);
  };

  return (
    <FavoritosContext.Provider value={{ favoritos, toggleFavorito, isFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  return useContext(FavoritosContext);
}