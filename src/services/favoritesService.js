import { globalStoreSupabase } from './globalStoreSupabase';

const favoritosStore = globalStoreSupabase('favoritos_usuarios');

export const favoritesService = {
  async getFavoritesByUser(userId) {
    const { data, error } = await favoritosStore.getAll(`
      repuesto_id,
      repuestos (
        id, sku, nombre,
        inventario_tienda (precio_usd, stock)
      )
    `, { usuario_id: userId });

    if (error) throw error;

    return {
      data: (data || []).map((item) => ({
        id: item.repuestos.id,
        sku: item.repuestos.sku,
        nombre: item.repuestos.nombre,
        precio: item.repuestos.inventario_tienda?.[0]?.precio_usd || '0.00',
        stock: item.repuestos.inventario_tienda?.[0]?.stock || 0
      })),
      error: null
    };
  },

  async addFavorite(userId, repuestoId) {
    const { error } = await favoritosStore.insert({ usuario_id: userId, repuesto_id: repuestoId });
    return { error };
  },

  async removeFavorite(userId, repuestoId) {
    const { error } = await favoritosStore.delete({ usuario_id: userId, repuesto_id: repuestoId });
    return { error };
  }
};
