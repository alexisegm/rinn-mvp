// src/features/favoritos/FavoritosView.jsx
import { Link } from 'react-router-dom';
import { useFavoritos } from '../../context/FavoritosContext';
import RepuestoCard from '../catalogo/components/RepuestoCard';
import EmptyState from '../../ui/EmptyState';

export default function FavoritosView() {
  // Consumimos directamente nuestro contexto global
  const { favoritos } = useFavoritos();

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto">
      <div className="mb-6 pb-4 border-b border-slate-800 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white">Tus Favoritos</h2>
          <p className="text-sm text-slate-400 mt-1">Repuestos guardados para acceso rápido.</p>
        </div>
        <div className="text-sm text-slate-500 font-mono">
          {favoritos.length} {favoritos.length === 1 ? 'ítem' : 'ítems'}
        </div>
      </div>

      {favoritos.length === 0 ? (
        <div className="mt-8">
          <EmptyState 
            titulo="No tienes favoritos guardados" 
            mensaje="Explora el catálogo y haz clic en el corazón de los repuestos que necesites tener a la mano." 
          />
          <div className="flex justify-center mt-6">
            <Link 
              to="/catalogo" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Ir al Catálogo
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favoritos.map((repuesto) => (
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
  );
}