import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function CarritoView() {
  const { carrito, eliminarDelCarrito, actualizarCantidad, limpiarCarrito, totalItems, totalPrecio, procesarOrden } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [enviando, setEnviando] = useState(false);

  const handlePagar = async () => {
    if (!user) {
      alert("Debes iniciar sesión para poder procesar tu pedido.");
      navigate('/auth');
      return;
    }

    try {
      setEnviando(true);

      const ordenIdGenerado = await procesarOrden(user.id);
      
      if (ordenIdGenerado) {
        navigate('/checkout/success', { 
          state: { ordenId: ordenIdGenerado } 
        });
      } else {
        alert("Hubo un problema al procesar la orden. Inténtalo de nuevo.");
      }
      
    } catch (error) {
      console.error("Error al procesar la orden:", error);
      alert("Hubo un problema crítico al registrar tu pedido.");
    } finally {
      setEnviando(false);
    }
  };

  if (carrito.length === 0) {
    return (
      <div className="max-w-7xl mx-auto w-full mt-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-3xl font-bold text-white mb-4">Tu pedido está vacío</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">Aún no has agregado repuestos a tu orden de compra. Ve al catálogo para encontrar lo que necesitas.</p>
        <Link to="/catalogo" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded transition-colors inline-block">
          Explorar Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-white mb-8">Resumen de tu Pedido</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        <div className="w-full lg:w-2/3 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl h-fit">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-slate-200">Repuestos Seleccionados ({totalItems})</h2>
            <button 
              onClick={limpiarCarrito}
              disabled={enviando}
              className="text-sm text-red-400 hover:text-red-300 transition-colors font-medium border border-red-400/20 px-3 py-1 rounded bg-red-400/10 disabled:opacity-50"
            >
              Vaciar carrito
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {carrito.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-slate-800/50 pb-6 last:border-0 last:pb-0">
                <div className="w-16 h-16 bg-slate-800 rounded border border-slate-700 flex-shrink-0 flex items-center justify-center">
                  <span className="text-xs text-slate-500">IMG</span>
                </div>
                
                <div className="flex-1">
                  <span className="text-xs text-slate-500 font-mono tracking-widest">{item.sku}</span>
                  <h3 className="text-slate-200 font-medium leading-tight mb-1">{item.nombre}</h3>
                  <span className="text-emerald-400 font-bold block">${item.precio}</span>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0">
                  <div className="flex items-center gap-3 bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <button 
                      onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                      disabled={enviando}
                      className="w-8 h-8 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white rounded transition-colors disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-white">{item.cantidad}</span>
                    <button 
                      onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                      disabled={item.cantidad >= item.stock || enviando}
                      className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${item.cantidad >= item.stock ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                    >
                      +
                    </button>
                  </div>

                  <button 
                    onClick={() => eliminarDelCarrito(item.id)}
                    disabled={enviando}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors disabled:opacity-30"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl sticky top-24">
            <h2 className="text-lg font-bold text-white mb-6">Resumen Financiero</h2>
            
            <div className="space-y-3 mb-6 pb-6 border-b border-slate-800">
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Subtotal</span>
                <span>${totalPrecio.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Impuestos (16%)</span>
                <span>Calculado al final</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Total Estimado</span>
              <span className="text-3xl font-black text-emerald-400">${totalPrecio.toFixed(2)}</span>
            </div>

            <button 
              onClick={handlePagar}
              disabled={enviando}
              className={`w-full text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                enviando ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              {enviando ? 'Procesando en la nube...' : 'Pagar'}
              {!enviando && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}