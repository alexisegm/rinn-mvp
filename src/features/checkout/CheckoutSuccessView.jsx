import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../../config/supabase';

export default function CheckoutSuccessView() {
  const location = useLocation();
  const ordenId = location.state?.ordenId || null;
  
  const [detallesOrden, setDetallesOrden] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetallesOrden = async () => {
      if (!ordenId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('ordenes')
          .select('*, orden_detalles(cantidad, precio_unitario, repuestos(nombre, sku))')
          .eq('id', ordenId)
          .single();

        if (error) throw error;
        if (data) setDetallesOrden(data);
      } catch (error) {
        console.error("Error al cargar la orden:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetallesOrden();
  }, [ordenId]);

  if (!ordenId) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-8 bg-slate-900 border border-slate-800 rounded-xl text-center">
        <h2 className="text-2xl font-bold text-white mb-4">No hay información de orden reciente</h2>
        <Link to="/catalogo" className="text-blue-400 hover:text-blue-300 transition-colors">Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl">
      
      <div className="text-center">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h2 className="text-3xl font-black text-white mb-2">¡Orden Procesada!</h2>
        <p className="text-slate-400 mb-8">Tu pedido ha sido registrado en la nube de forma segura.</p>

        <div className="bg-slate-800/80 p-4 rounded-lg mb-8 inline-block border border-slate-700 min-w-[250px]">
          <p className="text-sm text-slate-400 mb-1">Número de Orden de Rastreo</p>
          <p className="text-sm font-mono font-bold text-blue-400 break-all">{ordenId}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-4 text-slate-500 text-sm">Cargando desglose de tu compra...</div>
      ) : (
        detallesOrden && (
          <div className="mb-8 border border-slate-700 rounded-lg overflow-hidden">
            <div className="bg-slate-800 p-3 border-b border-slate-700">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Resumen de tu compra</h3>
            </div>
            <div className="p-4 bg-slate-800/30">
              <ul className="space-y-3 mb-4">
                {detallesOrden.orden_detalles?.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-start text-sm">
                    <div className="flex flex-col">
                      <span className="text-slate-200 font-medium">
                        {item.cantidad}x {item.repuestos?.nombre || 'Producto'}
                      </span>
                      <span className="text-slate-500 text-xs font-mono">{item.repuestos?.sku}</span>
                    </div>
                    <span className="text-slate-300">${item.precio_unitario}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-slate-700 flex justify-between items-center">
                <span className="text-slate-400 font-medium">Total Pagado:</span>
                <span className="text-2xl font-black text-emerald-400">
                  ${detallesOrden.total || detallesOrden.precio_total || '0.00'}
                </span>
              </div>
            </div>
          </div>
        )
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
        <Link 
          to="/perfil" 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-center rounded-lg transition-colors shadow-lg shadow-blue-900/20"
        >
          Ver en mi perfil
        </Link>
        <Link 
          to="/catalogo" 
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-center rounded-lg transition-colors border border-slate-700"
        >
          Volver al catálogo
        </Link>
      </div>
    </div>
  );
}