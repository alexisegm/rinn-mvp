import { useGarage } from '../../../context/GarageContext';

export default function GarageSelector() {
  const { vehiculosDisponibles, vehiculoActivo, seleccionarVehiculo, limpiarGarage, isLoadingGarage } = useGarage();

  if (isLoadingGarage) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 shadow-xl flex items-center justify-center">
        <span className="text-slate-400 font-medium">Abriendo tu Garage...</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🚘</span>
        <h2 className="text-xl font-bold text-white">Tu Garage</h2>
      </div>
      
      {vehiculoActivo ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg gap-4">
          <div>
            <p className="text-sm text-blue-400 font-bold uppercase tracking-wider mb-1">Vehículo Activo</p>
            <p className="text-xl text-white font-black">
              {vehiculoActivo.marca} {vehiculoActivo.modelo} <span className="text-slate-400 font-normal">{vehiculoActivo.ano}</span>
            </p>
            <p className="text-sm text-slate-400 mt-1 font-mono">Motor: {vehiculoActivo.motor}</p>
          </div>
          <button 
            onClick={limpiarGarage}
            className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm font-medium transition-colors border border-slate-700 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            Quitar Filtro
          </button>
        </div>
      ) : (
        <div>
          <p className="text-sm text-slate-400 mb-4">Selecciona tu vehículo para filtrar el catálogo y ver repuestos 100% compatibles.</p>
          
          {vehiculosDisponibles.length === 0 ? (
            <div className="text-sm text-slate-500 italic">Cargando vehículos disponibles...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {vehiculosDisponibles.map((vehiculo) => (
                <button
                  key={vehiculo.id}
                  onClick={() => seleccionarVehiculo(vehiculo)}
                  className="flex flex-col items-start p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all text-left group hover:border-blue-500/50"
                >
                  <span className="text-white font-bold group-hover:text-blue-400 transition-colors text-lg">
                    {vehiculo.marca} {vehiculo.modelo}
                  </span>
                  <span className="text-sm text-slate-400 mt-1 font-mono">
                    {vehiculo.ano} • {vehiculo.motor}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}