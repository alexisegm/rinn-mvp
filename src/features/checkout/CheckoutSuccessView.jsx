// src/features/checkout/CheckoutSuccessView.jsx
import { Link, useLocation } from 'react-router-dom';

export default function CheckoutSuccessView() {
  // Recibimos el ID de la orden que el carrito nos enviará al redirigir
  const location = useLocation();
  const ordenId = location.state?.ordenId || 'No disponible';

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-slate-900 border border-slate-800 rounded-xl text-center shadow-2xl">
      
      {/* Icono de Check */}
      <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      
      <h2 className="text-3xl font-black text-white mb-2">¡Orden Procesada!</h2>
      <p className="text-slate-400 mb-6">Tu pedido ha sido registrado en la nube de forma segura.</p>

      {/* Tarjeta con el ID de la Orden */}
      <div className="bg-slate-800/80 p-4 rounded-lg mb-8 inline-block border border-slate-700 min-w-[250px]">
        <p className="text-sm text-slate-400 mb-1">Número de Orden de Rastreo</p>
        <p className="text-sm font-mono font-bold text-blue-400 break-all">{ordenId}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          to="/perfil" 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20"
        >
          Ver en mi perfil
        </Link>
        <Link 
          to="/catalogo" 
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors border border-slate-700"
        >
          Volver al catálogo
        </Link>
      </div>
    </div>
  );
}