export default function ResumenEntrega({
  tipoEntrega,
  setTipoEntrega,
  sucursalSeleccionada,
  setSucursalSeleccionada,
  tiendas,
  totalPrecio,
  costoEnvio,
  totalFinal,
  enviando,
  onPagar
}) {
  return (
    <div className="w-full lg:w-1/3">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl sticky top-24">
        <h2 className="text-lg font-bold text-white mb-6">Método de Entrega</h2>
        
        <div className="flex bg-slate-800 p-1 rounded-lg mb-6">
          <button
            onClick={() => setTipoEntrega('envio')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${tipoEntrega === 'envio' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            🚚 Domicilio
          </button>
          <button
            onClick={() => setTipoEntrega('retiro')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${tipoEntrega === 'retiro' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            🏪 Retiro
          </button>
        </div>

        {tipoEntrega === 'retiro' && (
          <div className="mb-6 animate-fade-in">
            <label className="block text-sm text-slate-400 mb-2">Selecciona la sucursal de retiro:</label>
            <select 
              value={sucursalSeleccionada}
              onChange={(e) => setSucursalSeleccionada(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
            >
              <option value="" disabled>-- Elige una tienda --</option>
              {tiendas.map((tienda) => (
                <option key={tienda.id} value={tienda.id}>
                  {tienda.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        <h2 className="text-lg font-bold text-white mb-4 border-t border-slate-800 pt-6">Resumen Financiero</h2>
        
        <div className="space-y-3 mb-6 pb-6 border-b border-slate-800">
          <div className="flex justify-between text-slate-400 text-sm">
            <span>Subtotal</span>
            <span>${totalPrecio.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-400 text-sm">
            <span>Costo de Envío</span>
            <span>{tipoEntrega === 'envio' ? `$${costoEnvio.toFixed(2)}` : 'Gratis'}</span>
          </div>
        </div>

        <div className="flex justify-between items-end mb-8">
          <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Total Estimado</span>
          <span className="text-3xl font-black text-emerald-400">${totalFinal.toFixed(2)}</span>
        </div>

        <button 
          onClick={onPagar}
          disabled={enviando}
          className={`w-full text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            enviando ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' : 'bg-blue-600 hover:bg-blue-500'
          }`}
        >
          {enviando ? 'Procesando en la nube...' : 'Pagar'}
          {!enviando && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
        </button>
      </div>
    </div>
  );
}
