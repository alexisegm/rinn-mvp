import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

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

        const { data, error: supabaseError } = await supabase
          .from('repuestos')
          .select(`
            id, 
            sku, 
            nombre,
            descripcion,
            especificaciones,
            categorias (nombre),
            inventario_tienda (
              precio_usd, 
              stock,
              tiendas (nombre, direccion, coordenadas)
            )
          `)
          .eq('sku', sku)
          .single();

        if (supabaseError) throw supabaseError;
        
        if (!data) {
          throw new Error("No se encontró el repuesto en la base de datos.");
        }

        const totalStock = data.inventario_tienda?.reduce((acc, curr) => acc + (curr.stock || 0), 0) || 0;
        const precioRef = data.inventario_tienda[0]?.precio_usd || "0.00";

        const tiendasDisponibles = data.inventario_tienda
          ?.filter(inv => inv.stock > 0)
          .map(inv => ({
            nombre: inv.tiendas?.nombre,
            direccion: inv.tiendas?.direccion,
            coordenadas: inv.tiendas?.coordenadas,
            stock: inv.stock
          })) || [];

        const repuestoFormateado = {
          id: data.id,
          sku: data.sku,
          nombre: data.nombre,
          descripcion: data.descripcion || "Sin descripción detallada disponible.",
          especificaciones: data.especificaciones || null,
          categoria: data.categorias?.nombre || "General",
          precio: precioRef,
          stock: totalStock,
          disponibilidad: tiendasDisponibles
        };

        setRepuesto(repuestoFormateado);

        if (data.id && vehiculoId) {
          const { data: dataCompat, error: errorCompat } = await supabase
            .from('compatibilidades')
            .select('vehiculo_id')
            .eq('repuesto_id', data.id)
            .eq('vehiculo_id', vehiculoId)
            .maybeSingle();

          if (errorCompat) throw errorCompat;
          
          setEsCompatible(!!dataCompat);
        } else {
          setEsCompatible(null);
        }

      } catch (err) {
        console.error("Error en useRepuesto:", err);
        if (err.code === 'PGRST116') {
          setError("El repuesto que buscas no existe o fue retirado del catálogo.");
        } else {
          setError("No se pudo cargar la información técnica del repuesto.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepuestoDetalle();
  }, [sku, vehiculoId]);

  return { repuesto, esCompatible, isLoading, error };
}