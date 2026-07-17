import { globalStoreSupabase } from './globalStoreSupabase';

const vehiculosStore = globalStoreSupabase('vehiculos');
const usuarioVehiculoStore = globalStoreSupabase('usuario_vehiculo');

export const garageService = {
  async getVehiculos() {
    const { data, error } = await vehiculosStore.getAll('*', {}, { orderBy: { column: 'marca', ascending: true } });
    return { data: data || [], error };
  },

  async getVehiculoActivo(userId) {
    const { data, error } = await usuarioVehiculoStore.getOne('vehiculo_id, vehiculos(*)', { usuario_id: userId });
    return { data, error };
  },

  async selectVehiculo(userId, vehiculo) {
    if (!userId) return { error: null };

    if (vehiculo) {
      const { error } = await usuarioVehiculoStore.upsert(
        { usuario_id: userId, vehiculo_id: vehiculo.id },
        { onConflict: 'usuario_id' }
      );
      return { error };
    }

    const { error } = await usuarioVehiculoStore.delete({ usuario_id: userId });
    return { error };
  }
};
