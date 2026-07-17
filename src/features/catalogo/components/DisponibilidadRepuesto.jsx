export default function DisponibilidadRepuesto({ repuesto }) {
  if (!repuesto.disponibilidad || repuesto.disponibilidad.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-10 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4 flex items-center gap-3">
        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
        Disponibilidad en Sucursales
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repuesto.disponibilidad.map((tienda, idx) => (
          <div key={idx} className="bg-slate-800/50 border border-slate-700 p-5 rounded-lg flex flex-col justify-between hover:border-slate-600 transition-colors">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white">{tienda.nombre}</h3>
                <span className="bg-emerald-900/30 text-emerald-400 text-xs px-2 py-1 rounded font-bold border border-emerald-500/20">
                  {tienda.stock} uds.
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-4">{tienda.direccion}</p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tienda.coordenadas || tienda.direccion)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-bold transition-colors w-max"
            >
              <span className="text-lg">📍</span> Ver en mapa
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
