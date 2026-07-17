import { Link } from 'react-router-dom';

export default function DetalleRepuestoHeader({ sku }) {
  return (
    <div className="mb-6 text-sm font-medium">
      <Link to="/catalogo" className="text-slate-400 hover:text-blue-400 transition-colors">
        Catálogo
      </Link>
      <span className="mx-3 text-slate-600">/</span>
      <span className="text-slate-200">{sku}</span>
    </div>
  );
}
