import { globalStoreSupabase } from './globalStoreSupabase';

const ordenesStore = globalStoreSupabase('ordenes');
const ordenDetallesStore = globalStoreSupabase('orden_detalles');

export const ordersService = {
  async getOrderById(id) {
    const { data, error } = await ordenesStore.getById(id, '*, orden_detalles(cantidad, precio_unitario, repuestos(nombre, sku))');
    return { data, error };
  },

  async getOrdersByUser(userId) {
    const { data, error } = await ordenesStore.getAll('*, orden_detalles(cantidad, precio_unitario, repuestos(nombre, sku))', { usuario_id: userId }, { orderBy: { column: 'creado_en', ascending: false } });
    return { data: data || [], error };
  },

  async createOrder({ usuarioId, datosEnvio = {}, totalFinal, carrito }) {
    const totalSeguro = totalFinal || carrito.reduce((sum, item) => sum + (parseFloat(item.precio) * item.cantidad), 0);

    const { data: orden, error: ordenError } = await ordenesStore.insert({
      usuario_id: usuarioId,
      total: totalSeguro,
      estado: 'pendiente',
      ...datosEnvio
    }, '*');

    if (ordenError) throw ordenError;

    const detalles = carrito.map((item) => ({
      orden_id: orden.id,
      repuesto_id: item.id,
      cantidad: item.cantidad,
      precio_unitario: parseFloat(item.precio)
    }));

    const { error: detallesError } = await ordenDetallesStore.insertMany(detalles);
    if (detallesError) throw detallesError;

    return { data: orden, error: null };
  }
};
