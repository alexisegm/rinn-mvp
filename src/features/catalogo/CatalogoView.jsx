import { useState } from 'react';
import { Link } from 'react-router-dom';
import SidebarFiltros from './components/SidebarFiltros';
import RepuestoCard from './components/RepuestoCard';
import LoadingState from '../../ui/LoadingState';
import ErrorMessage from '../../ui/ErrorMessage';
import EmptyState from '../../ui/EmptyState';
import { useCatalogo } from '../../hooks/useCatalogo';
import { useSearch } from '../../context/SearchContext';
import { useGarage } from '../../context/GarageContext';

export default function CatalogoView() {
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const { searchTerm, ejecutarBusqueda } = useSearch();
  const { vehiculoActivo, isLoadingGarage } = useGarage();
  const { repuestos, isLoading, error, refetch } = useCatalogo(categoriaActiva, searchTerm, vehiculoActivo?.id);

  const showLoading = isLoading || isLoadingGarage;

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      <SidebarFiltros 
        categoriaActiva={categoriaActiva} 
        setCategoriaActiva={setCategoriaActiva} 
      />

      <div className="flex-1 flex flex-col">
        
        {!isLoadingGarage && (
          vehiculoActivo ? (
            <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-lg mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="text-emerald-400 font-bold text-sm">Mostrando repuestos garantizados para:</p>
                  <p className="text-white font-black text-lg">
                    {vehiculoActivo.marca} {vehiculoActivo.modelo} <span className="text-slate-400 font-normal">{vehiculoActivo.ano}</span>
                  </p>
                </div>
              </div>
              <Link 
                to="/perfil" 
                className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-white text-sm font-bold rounded-md transition-colors"
              >
                Cambiar vehículo
              </Link>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚗</span>
                <div>
                  <p className="text-white font-bold">Navegación general activada</p>
                  <p className="text-slate-400 text-sm">Configura tu auto para ver piezas exactas.</p>
                </div>
              </div>
              <Link 
                to="/perfil" 
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-md transition-colors shadow-lg shadow-blue-900/20"
              >
                Configurar mi Garage
              </Link>
            </div>
          )
        )}

        <div className="mb-6 pb-4 border-b border-slate-800 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-white">Catálogo de Repuestos</h2>
            <p className="text-sm text-slate-400 mt-1">Explora nuestro inventario disponible.</p>
            
            {searchTerm && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-slate-400">Resultados para:</span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full text-sm font-medium">
                  "{searchTerm}"
                  <button 
                    onClick={() => ejecutarBusqueda("")} 
                    className="hover:text-white transition-colors"
                    title="Limpiar búsqueda"
                  >
                    ×
                  </button>
                </span>
              </div>
            )}
          </div>
          
          {!showLoading && (
            <div className="text-sm text-slate-500 font-mono">
              Mostrando {repuestos.length} resultados
            </div>
          )}
        </div>
        
        {showLoading && (
          <div className="mt-8">
            <LoadingState />
          </div>
        )}

        {!showLoading && error && (
          <div className="mt-8">
            <ErrorMessage mensaje={error} onRetry={refetch} />
          </div>
        )}

        {!showLoading && !error && repuestos.length === 0 && (
          <div className="mt-8">
            <EmptyState 
              titulo="Sin resultados" 
              mensaje={searchTerm 
                ? `No encontramos ningún repuesto que coincida con "${searchTerm}". Intenta con otros términos o SKU.`
                : "No hay repuestos disponibles en esta categoría actualmente."
              } 
            />
          </div>
        )}

        {!showLoading && !error && repuestos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {repuestos.map((repuesto) => (
              <RepuestoCard 
                key={repuesto.id}
                id={repuesto.id}
                sku={repuesto.sku} 
                nombre={repuesto.nombre} 
                precio={repuesto.precio} 
                stock={repuesto.stock}
                imagenUrl={null}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}