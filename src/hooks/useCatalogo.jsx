import { useState, useEffect } from 'react';
import { catalogService } from '../services/catalogService';

export function useCatalogo(categoriaId = null, searchTerm = "", vehiculoId = null) {
  const [repuestos, setRepuestos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRepuestos = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: serviceError } = await catalogService.getCatalogo({
        categoriaId,
        searchTerm,
        vehiculoId
      });

      if (serviceError) throw serviceError;
      setRepuestos(data || []);
    } catch (err) {
      console.error('Error en useCatalogo:', err);
      setError('No se pudo cargar el catálogo de repuestos. Verifica tu conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRepuestos();
  }, [categoriaId, searchTerm, vehiculoId]);

  return { repuestos, isLoading, error, refetch: fetchRepuestos };
}