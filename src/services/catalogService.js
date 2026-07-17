import { globalStoreSupabase } from './globalStoreSupabase';

const repuestosStore = globalStoreSupabase('repuestos');
const categoriasStore = globalStoreSupabase('categorias');
const tiendasStore = globalStoreSupabase('tiendas');
const compatibilidadesStore = globalStoreSupabase('compatibilidades');

export const catalogService = {
  async getCatalogo({ categoriaId = null, searchTerm = '', vehiculoId = null } = {}) {
    let query = repuestosStore.getAll(`
      id, sku, nombre, categoria_id,
      inventario_tienda (precio_usd, stock)
    `);

    const { data, error } = await query;

    if (error) throw error;

    const repuestosFormateados = data.map((item) => ({
      id: item.id,
      sku: item.sku,
      nombre: item.nombre,
      precio: item.inventario_tienda?.[0]?.precio_usd || '0.00',
      stock: item.inventario_tienda?.[0]?.stock || 0,
      categoria_id: item.categoria_id
    }));

    let filtered = repuestosFormateados;

    if (vehiculoId) {
      const { data: compatData, error: compatError } = await compatibilidadesStore.getAll('*', { vehiculo_id: vehiculoId });
      if (compatError) throw compatError;
      const compatibleIds = new Set((compatData || []).map((item) => item.repuesto_id));
      filtered = filtered.filter((item) => compatibleIds.has(item.id));
    }

    if (categoriaId) {
      filtered = filtered.filter((item) => item.categoria_id === categoriaId);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((item) => item.nombre.toLowerCase().includes(term) || item.sku.toLowerCase().includes(term));
    }

    return { data: filtered, error: null };
  },

  async getRepuestoBySku(sku, vehiculoId = null) {
    const { data, error } = await repuestosStore.getOne(`
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
    `, { sku });

    if (error) throw error;
    if (!data) return { data: null, error: null };

    const totalStock = data.inventario_tienda?.reduce((acc, curr) => acc + (curr.stock || 0), 0) || 0;
    const precioRef = data.inventario_tienda?.[0]?.precio_usd || '0.00';
    const tiendasDisponibles = (data.inventario_tienda || [])
      .filter((inv) => inv.stock > 0)
      .map((inv) => ({
        nombre: inv.tiendas?.nombre,
        direccion: inv.tiendas?.direccion,
        coordenadas: inv.tiendas?.coordenadas,
        stock: inv.stock
      }));

    const repuestoFormateado = {
      id: data.id,
      sku: data.sku,
      nombre: data.nombre,
      descripcion: data.descripcion || 'Sin descripción detallada disponible.',
      especificaciones: data.especificaciones || null,
      categoria: data.categorias?.nombre || 'General',
      precio: precioRef,
      stock: totalStock,
      disponibilidad: tiendasDisponibles
    };

    let compatibilidad = null;
    if (vehiculoId) {
      const { data: compatData, error: compatError } = await compatibilidadesStore.getOne('*', {
        repuesto_id: data.id,
        vehiculo_id: vehiculoId
      });
      if (compatError) throw compatError;
      compatibilidad = !!compatData;
    }

    return { data: { repuesto: repuestoFormateado, esCompatible: compatibilidad }, error: null };
  },

  async getCategorias() {
    const { data, error } = await categoriasStore.getAll('id, nombre', {}, { orderBy: { column: 'nombre' } });
    return { data: data || [], error };
  },

  async getTiendas() {
    const { data, error } = await tiendasStore.getAll('id, nombre, direccion');
    return { data: data || [], error };
  }
};
