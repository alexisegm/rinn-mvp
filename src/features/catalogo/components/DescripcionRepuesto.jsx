export default function DescripcionRepuesto({ repuesto }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-10 shadow-xl mb-8">
      <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Detalles del Producto</h2>
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Descripción</h3>
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">{repuesto.descripcion}</p>
        </div>

        {repuesto.especificaciones && Object.keys(repuesto.especificaciones).length > 0 && (
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Especificaciones Técnicas</h3>
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
              <table className="w-full text-sm text-left">
                <tbody className="divide-y divide-slate-700/50">
                  {Object.entries(repuesto.especificaciones).map(([key, value]) => (
                    <tr key={key} className="hover:bg-slate-700/30 transition-colors">
                      <th className="px-4 py-3 font-medium text-slate-400 w-1/3 bg-slate-800/80">{key}</th>
                      <td className="px-4 py-3 text-slate-200">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
