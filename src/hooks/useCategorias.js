// src/hooks/useCategorias.js
import { useState, useEffect } from 'react';
import { catalogService } from '../services/catalogService';

export function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [isLoadingCat, setIsLoadingCat] = useState(true);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setIsLoadingCat(true);
        const { data, error } = await catalogService.getCategorias();
        if (error) throw error;
        setCategorias(data || []);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      } finally {
        setIsLoadingCat(false);
      }
    };

    fetchCategorias();
  }, []);

  return { categorias, isLoadingCat };
}