import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

export function useCatalogo(categoriaId = null, searchTerm = "", vehiculoId = null) {
  const [repuestos, setRepuestos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRepuestos = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query;

      if (vehiculoId) {
        query = supabase
          .from('repuestos')
          .select(`
            id, sku, nombre, categoria_id,
            inventario_tienda (precio_usd, stock),
            compatibilidades!inner(vehiculo_id)
          `)
          .eq('compatibilidades.vehiculo_id', vehiculoId);
      } else {
        query = supabase
          .from('repuestos')
          .select(`
            id, sku, nombre, categoria_id,
            inventario_tienda (precio_usd, stock)
          `);
      }

      if (categoriaId) {
        query = query.eq('categoria_id', categoriaId);
      }

      if (searchTerm) {
        query = query.or(`nombre.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;

      if (data) {
        const repuestosFormateados = data.map(item => {
          const { compatibilidades, ...restoDelRepuesto } = item;
          return {
            id: restoDelRepuesto.id,
            sku: restoDelRepuesto.sku,
            nombre: restoDelRepuesto.nombre,
            precio: restoDelRepuesto.inventario_tienda[0]?.precio_usd || "0.00",
            stock: restoDelRepuesto.inventario_tienda[0]?.stock || 0
          };
        });
        setRepuestos(repuestosFormateados);
      }

    } catch (err) {
      console.error("Error en useCatalogo:", err);
      setError("No se pudo cargar el catálogo de repuestos. Verifica tu conexión.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRepuestos();
  }, [categoriaId, searchTerm, vehiculoId]);

  return { repuestos, isLoading, error, refetch: fetchRepuestos };
}