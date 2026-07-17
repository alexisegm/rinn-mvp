import { Link } from 'react-router-dom';

export default function CarritoVacio() {
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
