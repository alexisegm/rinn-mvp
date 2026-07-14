import { useState } from 'react';
import SidebarFiltros from './components/SidebarFiltros';
import RepuestoCard from './components/RepuestoCard';
import LoadingState from '../../ui/LoadingState';
import ErrorMessage from '../../ui/ErrorMessage';
import EmptyState from '../../ui/EmptyState';
import { useCatalogo } from '../../hooks/useCatalogo';
import { useSearch } from '../../context/SearchContext';
import { useGarage } from '../../context/GarageContext';
import GarageSelector from './components/GarageSelector';

export default function CatalogoView() {
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const { searchTerm, ejecutarBusqueda } = useSearch();
  const { vehiculoActivo } = useGarage();
  const { repuestos, isLoading, error, refetch } = useCatalogo(categoriaActiva, searchTerm, vehiculoActivo?.id);

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      <SidebarFiltros 
        categoriaActiva={categoriaActiva} 
        setCategoriaActiva={setCategoriaActiva} 
      />

      <div className="flex-1 flex flex-col">
        <GarageSelector />

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
          
          <div className="text-sm text-slate-500 font-mono">
            Mostrando {repuestos.length} resultados
          </div>
        </div>
        
        {isLoading && <div className="mt-8"><LoadingState /></div>}
        {!isLoading && error && <div className="mt-8"><ErrorMessage mensaje={error} onRetry={refetch} /></div>}

        {!isLoading && !error && repuestos.length === 0 && (
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

        {!isLoading && !error && repuestos.length > 0 && (
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