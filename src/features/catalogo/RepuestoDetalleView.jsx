import { useParams, Link } from 'react-router-dom';
import { useRepuesto } from '../../hooks/useRepuesto';
import LoadingState from '../../ui/LoadingState';
import ErrorMessage from '../../ui/ErrorMessage';
import { useFavoritos } from '../../context/FavoritosContext';
import { useCart } from '../../context/CartContext';
import { useGarage } from '../../context/GarageContext';

export default function RepuestoDetalleView() {
  const { sku } = useParams();
  const { vehiculoActivo } = useGarage();
  const { repuesto, esCompatible, isLoading, error } = useRepuesto(sku, vehiculoActivo?.id);
  const { toggleFavorito, isFavorito } = useFavoritos();
  const { agregarAlCarrito } = useCart();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto mt-8 w-full">
        <LoadingState mensaje={`Cargando detalles técnicos de ${sku}...`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto mt-8 w-full">
        <ErrorMessage mensaje={error} />
        <div className="mt-4 flex justify-center">
          <Link to="/catalogo" className="text-blue-400 hover:text-blue-300 underline font-medium">
            Volver al catálogo completo
          </Link>
        </div>
      </div>
    );
  }

  if (!repuesto) return null;

  const esFav = isFavorito(repuesto.id);

  const handleAgregarPedido = () => {
    agregarAlCarrito(repuesto, 1);
  };

  return (
    <div className="max-w-7xl mx-auto w-full pb-12">
      <div className="mb-6 text-sm font-medium">
        <Link to="/catalogo" className="text-slate-400 hover:text-blue-400 transition-colors">
          Catálogo
        </Link>
        <span className="mx-3 text-slate-600">/</span>
        <span className="text-slate-200">{repuesto.sku}</span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-10 shadow-2xl mb-8">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          
          <div className="w-full md:w-1/2 bg-slate-800 rounded-lg aspect-video flex flex-col items-center justify-center border border-slate-700 relative overflow-hidden group">
            <span className="text-slate-500 font-mono text-sm tracking-widest">IMAGEN NO DISPONIBLE</span>
            <button 
              onClick={() => toggleFavorito(repuesto)}
              className="absolute top-4 right-4 p-3 bg-slate-900/80 backdrop-blur-sm rounded-full hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <span className={`text-xl ${esFav ? 'text-red-500' : 'text-slate-400'}`}>
                {esFav ? '❤️' : '🤍'}
              </span>
            </button>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-slate-800 border border-slate-700 text-blue-400 text-xs font-bold uppercase tracking-widest rounded">
                {repuesto.categoria}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
              {repuesto.nombre}
            </h1>
            
            <p className="text-sm font-mono text-slate-400 mb-8 border-b border-slate-800 pb-6">
              SKU: {repuesto.sku}
            </p>
            
            <div className="flex items-end gap-8 mb-8">
              <div>
                <span className="block text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Precio Unitario</span>
                <span className="text-4xl font-black text-emerald-400">${repuesto.precio}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Disponibilidad</span>
                <span className={`text-lg font-medium ${repuesto.stock > 0 ? 'text-slate-200' : 'text-red-400'}`}>
                  {repuesto.stock > 0 ? `${repuesto.stock} uds. en inventario` : 'Sin stock'}
                </span>
              </div>
            </div>

            {vehiculoActivo && (
              <div className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${
                esCompatible 
                  ? 'bg-emerald-900/20 border-emerald-500/30' 
                  : 'bg-amber-900/20 border-amber-500/30'
              }`}>
                <span className="text-xl mt-0.5">{esCompatible ? '✅' : '⚠️'}</span>
                <div>
                  <h4 className={`font-bold ${esCompatible ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {esCompatible ? 'Ajuste exacto' : 'Compatibilidad no confirmada'}
                  </h4>
                  <p className="text-sm text-slate-300 mt-1">
                    {esCompatible 
                      ? `Esta pieza está garantizada para tu ${vehiculoActivo.marca} ${vehiculoActivo.modelo} ${vehiculoActivo.ano}.`
                      : `No tenemos registro de que esta pieza encaje en tu ${vehiculoActivo.marca} ${vehiculoActivo.modelo} ${vehiculoActivo.ano}. Verifica las especificaciones antes de comprar.`}
                  </p>
                </div>
              </div>
            )}

            <button 
              onClick={handleAgregarPedido}
              disabled={repuesto.stock === 0}
              className={`w-full py-4 rounded font-bold transition-colors text-lg flex items-center justify-center gap-2 ${
                repuesto.stock > 0 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              {repuesto.stock > 0 ? 'Añadir al Pedido' : 'Agotado'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-10 shadow-xl mb-8">
        <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Detalles del Producto</h2>
        
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Descripción</h3>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
              {repuesto.descripcion}
            </p>
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

      {repuesto.disponibilidad && repuesto.disponibilidad.length > 0 && (
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
      )}
    </div>
  );
}