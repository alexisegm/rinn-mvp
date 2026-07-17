export default function ListaOrdenes({ ordenes }) {
  return (
    <div className="space-y-4">
      {ordenes.map((orden) => (
        <div key={orden.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors flex flex-col">
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
  );
}
