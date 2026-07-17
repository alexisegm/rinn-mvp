// src/context/FavoritosContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { safeLocalStorage } from '../utils/safeLocalStorage';
import { useAuth } from './AuthContext';
import { favoritesService } from '../services/favoritesService';

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

  const fetchFavoritosNube = async () => {
    try {
      const { data, error } = await favoritesService.getFavoritesByUser(user.id);
      if (error) throw error;
      setFavoritos(data);
    } catch (error) {
      console.error('Error al cargar los favoritos de la nube:', error);
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
          const { error } = await favoritesService.removeFavorite(user.id, repuesto.id);
          if (error) throw error;
        } else {
          const { error } = await favoritesService.addFavorite(user.id, repuesto.id);
          if (error) throw error;
        }
      } catch (error) {
        console.error('Error sincronizando con la base de datos:', error);
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