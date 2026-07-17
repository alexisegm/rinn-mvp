import { useState } from 'react';
import SidebarFiltros from './components/SidebarFiltros';
import LoadingState from '../../ui/LoadingState';
import ErrorMessage from '../../ui/ErrorMessage';
import EmptyState from '../../ui/EmptyState';
import { useCatalogo } from '../../hooks/useCatalogo';
import { useSearch } from '../../context/SearchContext';
import { useGarage } from '../../context/GarageContext';
import HeaderCatalogo from './components/HeaderCatalogo';
import ListaRepuestos from './components/ListaRepuestos';

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
        <HeaderCatalogo
          vehiculoActivo={vehiculoActivo}
          isLoadingGarage={isLoadingGarage}
          searchTerm={searchTerm}
          ejecutarBusqueda={ejecutarBusqueda}
        />
        
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
          <ListaRepuestos repuestos={repuestos} />
        )}
      </div>
    </div>
  );
}