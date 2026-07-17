import { Link } from 'react-router-dom';
import { useCategorias } from '../../../hooks/useCategorias';
import { useGarage } from '../../../context/GarageContext';

export default function SidebarFiltros({ categoriaActiva, setCategoriaActiva }) {
  const { categorias, isLoadingCat } = useCategorias();
  const { vehiculoActivo } = useGarage();

  return (
    <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-6">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Mi Garaje
        </h3>
        
        {vehiculoActivo ? (
          <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded border border-slate-700">
            <div className="w-10 h-10 bg-blue-900/50 rounded flex items-center justify-center text-blue-400">🚗</div>
            <div>
              <p className="text-sm font-bold text-white">
                {vehiculoActivo.marca} {vehiculoActivo.modelo}
              </p>
              <p className="text-xs text-slate-400">Año: {vehiculoActivo.ano}</p>
            </div>
          </div>
        ) : (
          <div className="text-center bg-slate-800/30 p-4 rounded border border-slate-700/50">
            <p className="text-xs text-slate-400 mb-3">Navegación general activada.</p>
            <Link 
              to="/perfil" 
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded transition-colors block w-full"
            >
              Seleccionar Vehículo
            </Link>
          </div>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex-1">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Filtros de Categoría
        </h3>
        
        {isLoadingCat ? (
          <p className="text-sm text-slate-500 animate-pulse">Cargando filtros...</p>
        ) : (
          <ul className="space-y-1">
            <li>
              <button 
                onClick={() => setCategoriaActiva(null)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded font-medium text-sm transition-colors ${
                  categoriaActiva === null 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                }`}
              >
                <span>📦</span> Todos los repuestos
              </button>
            </li>
            
            {categorias.map((cat) => (
              <li key={cat.id}>
                <button 
                  onClick={() => setCategoriaActiva(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded font-medium text-sm transition-colors ${
                    categoriaActiva === cat.id 
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {cat.nombre}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}