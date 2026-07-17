import { useState, useEffect } from 'react';
import { catalogService } from '../services/catalogService';

export function useRepuesto(sku, vehiculoId = null) {
  const [repuesto, setRepuesto] = useState(null);
  const [esCompatible, setEsCompatible] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepuestoDetalle = async () => {
      if (!sku) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const { data, error: serviceError } = await catalogService.getRepuestoBySku(sku, vehiculoId);
        if (serviceError) throw serviceError;

        if (!data?.repuesto) {
          throw new Error('No se encontró el repuesto en la base de datos.');
        }

        setRepuesto(data.repuesto);
        setEsCompatible(data.esCompatible);
      } catch (err) {
        console.error('Error en useRepuesto:', err);
        if (err.code === 'PGRST116') {
          setError('El repuesto que buscas no existe o fue retirado del catálogo.');
        } else {
          setError('No se pudo cargar la información técnica del repuesto.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepuestoDetalle();
  }, [sku, vehiculoId]);

  return { repuesto, esCompatible, isLoading, error };
}