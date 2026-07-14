// src/features/catalogo/components/RepuestoCard.jsx
import { Link } from 'react-router-dom'; // <-- Asegúrate de importar Link
import FallbackImage from '../../../ui/FallbackImage';
import { useFavoritos } from '../../../context/FavoritosContext';

// 1. Asegúrate de recibir el 'id' en los props
export default function RepuestoCard({ id, sku, nombre, precio, stock, imagenUrl }) {
  // 2. Extraemos las funciones de nuestra "nube" global
  const { toggleFavorito, isFavorito } = useFavoritos();
  
  // 3. Verificamos si este repuesto específico está en favoritos
  const esFav = isFavorito(id);

  // 4. Función para manejar el clic en el corazón
  const handleToggle = (e) => {
    e.preventDefault(); // Evita que el clic propague acciones indeseadas
    // Guardamos el objeto completo en el contexto
    toggleFavorito({ id, sku, nombre, precio, stock, imagenUrl });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:border-slate-600 transition-colors flex flex-col group cursor-pointer">
      
      {/* Contenedor de la Imagen con Fallback */}
      <div className="h-48 border-b border-slate-800 relative">
        <FallbackImage src={imagenUrl} alt={nombre} />
        
        {/* NUEVO: Botón de Favorito */}
        <button
          onClick={handleToggle}
          className="absolute top-2 left-2 p-1.5 bg-slate-900/80 rounded-full hover:bg-slate-800 transition-colors z-10 border border-slate-700"
          title={esFav ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <span className={`text-lg transition-colors ${esFav ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'text-slate-400 opacity-70 hover:opacity-100'}`}>
            {esFav ? '❤️' : '🤍'}
          </span>
        </button>

        {/* Etiqueta de Stock bajo */}
        {stock > 0 && stock <= 5 && (
          <span className="absolute top-2 right-2 bg-amber-500/90 text-white text-xs font-bold px-2 py-1 rounded shadow">
            ¡Solo {stock} disponibles!
          </span>
        )}
      </div>
      
      {/* Contenido de la tarjeta (Se mantiene igual) */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-mono text-slate-500 mb-1">SKU: {sku}</span>
        <h4 className="text-sm font-bold text-slate-200 mb-3 line-clamp-2 flex-1 group-hover:text-blue-400 transition-colors">
          {nombre}
        </h4>
        
        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="text-xs text-slate-400 mb-1">Precio ref.</p>
            <p className="text-lg font-black text-emerald-400">${precio}</p>
          </div>
          <div className="text-right">
            <span className={`inline-block px-2 py-1 text-xs rounded border ${stock > 0 ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-red-950/50 text-red-400 border-red-900'}`}>
              {stock > 0 ? `Stock: ${stock}` : 'Agotado'}
            </span>
          </div>
        </div>
        
        {/* Aquí transformamos el botón en un enlace que apunte a la ruta dinámica */}
        <Link 
          to={`/repuesto/${sku}`}
          className="w-full mt-4 block text-center text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 py-2 rounded transition-colors"
        >
          Ver Detalles
        </Link>
      </div>
    </div>
  );
}