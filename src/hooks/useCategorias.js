// src/hooks/useCategorias.js
import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

export function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [isLoadingCat, setIsLoadingCat] = useState(true);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setIsLoadingCat(true);
        // Traemos los IDs y nombres de la tabla categorías
        const { data, error } = await supabase
          .from('categorias')
          .select('id, nombre')
          .order('nombre');
        
        if (error) throw error;
        setCategorias(data || []);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      } finally {
        setIsLoadingCat(false);
      }
    };

    fetchCategorias();
  }, []);

  return { categorias, isLoadingCat };
}