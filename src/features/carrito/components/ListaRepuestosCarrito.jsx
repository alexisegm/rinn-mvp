export default function ListaRepuestosCarrito({ carrito, enviando, actualizarCantidad, eliminarDelCarrito, limpiarCarrito }) {
  return (
    <div className="w-full lg:w-2/3 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl h-fit">
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-200">Repuestos Seleccionados ({carrito.length})</h2>
        <button 
          onClick={limpiarCarrito}
          disabled={enviando}
          className="text-sm text-red-400 hover:text-red-300 transition-colors font-medium border border-red-400/20 px-3 py-1 rounded bg-red-400/10 disabled:opacity-50"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {carrito.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-slate-800/50 pb-6 last:border-0 last:pb-0">
            <div className="w-16 h-16 bg-slate-800 rounded border border-slate-700 flex-shrink-0 flex items-center justify-center">
              <span className="text-xs text-slate-500">IMG</span>
            </div>
            
            <div className="flex-1">
              <span className="text-xs text-slate-500 font-mono tracking-widest">{item.sku}</span>
              <h3 className="text-slate-200 font-medium leading-tight mb-1">{item.nombre}</h3>
              <span className="text-emerald-400 font-bold block">${item.precio}</span>
            </div>

            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0">
              <div className="flex items-center gap-3 bg-slate-800 rounded-lg p-1 border border-slate-700">
                <button 
                  onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                  disabled={enviando}
                  className="w-8 h-8 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white rounded transition-colors disabled:opacity-30"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-bold text-white">{item.cantidad}</span>
                <button 
                  onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                  disabled={item.cantidad >= item.stock || enviando}
                  className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${item.cantidad >= item.stock ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                >
                  +
                </button>
              </div>

              <button 
                onClick={() => eliminarDelCarrito(item.id)}
                disabled={enviando}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors disabled:opacity-30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
