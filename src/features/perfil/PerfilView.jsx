import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import GarageSelector from '../catalogo/components/GarageSelector';
import { ordersService } from '../../services/ordersService';

export default function PerfilView() {
  const { user } = useAuth();
  const [ordenes, setOrdenes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistorial = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await ordersService.getOrdersByUser(user.id);

        if (error) throw error;
        if (data) setOrdenes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistorial();
  }, [user?.id]);

  if (isLoading) {
    return <div className="text-center p-12 text-slate-400">Cargando tu perfil e historial...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 shadow-xl flex items-center gap-4">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-black">
          {user?.email?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Mi Cuenta</h2>
          <p className="text-slate-400 text-sm font-mono">{user?.email}</p>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Mi Garage</h3>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <p className="text-slate-400 text-sm mb-4">
            Selecciona tu vehículo principal. El catálogo se filtrará automáticamente para mostrar solo repuestos compatibles con esta configuración.
          </p>
          <GarageSelector />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Historial de Pedidos</h3>

      {ordenes.length === 0 ? (
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-8 text-center text-slate-500 italic">
          Aún no has realizado ninguna compra en la plataforma.
        </div>
      ) : (
        <div className="space-y-4">
          {ordenes.map((orden) => (
            <div 
              key={orden.id} 
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors flex flex-col"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <span className="text-xs font-mono text-slate-500 block mb-1">ID: {orden.id}</span>
                  <p className="text-sm text-slate-400">
                    Fecha: <span className="text-white font-medium">{new Date(orden.creado_en).toLocaleDateString()}</span>
                  </p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 bg-blue-900/40 text-blue-400 text-xs font-bold rounded border border-blue-500/20 uppercase tracking-wider">
                    {orden.estado || 'Procesado'}
                  </span>
                </div>
                
                <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                  <span className="text-xs text-slate-500 block">Total Pagado</span>
                  <span className="text-xl font-black text-emerald-400">${orden.total || orden.precio_total || '0.00'}</span>
                </div>
              </div>

              {orden.orden_detalles && orden.orden_detalles.length > 0 && (
                <div className="border-t border-slate-800 pt-4 mt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Artículos del Pedido</h4>
                  <ul className="space-y-2">
                    {orden.orden_detalles.map((detalle, idx) => (
                      <li key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300 font-medium">{detalle.cantidad}x</span>
                          <span className="text-slate-200">{detalle.repuestos?.nombre || 'Repuesto Desconocido'}</span>
                          <span className="text-slate-500 text-xs hidden sm:inline">({detalle.repuestos?.sku || 'N/A'})</span>
                        </div>
                        <span className="text-slate-400 font-mono">${detalle.precio_unitario}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}