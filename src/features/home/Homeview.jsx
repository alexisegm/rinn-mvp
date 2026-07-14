// src/features/home/HomeView.jsx
import { Link } from 'react-router-dom';

export default function HomeView() {
  const categorias = [
    { id: 'repuestos-generales', nombre: 'Repuestos Generales', icono: '⚙️' },
    { id: 'desempeno-tuning', nombre: 'Desempeño y Tuning', icono: '🏎️' },
    { id: 'cauchos-rines', nombre: 'Cauchos y Rines', icono: '🛞' },
    { id: 'aceites-fluidos', nombre: 'Aceites y Fluidos', icono: '🛢️' },
    { id: 'cuidado-vehiculo', nombre: 'Cuidado del Vehículo', icono: '🧼' },
    { id: 'accesorios-interiores', nombre: 'Accesorios Interiores', icono: '💺' },
    { id: 'accesorios-exteriores', nombre: 'Accesorios Exteriores', icono: '🛡️' },
    { id: 'herramientas', nombre: 'Herramientas', icono: '🧰' }
  ];

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Sección Hero / Garaje Rápido */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Encuentra el repuesto exacto.</h1>
          <p className="text-slate-400">Selecciona una categoría para ver compatibilidades garantizadas para tu vehículo.</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg flex items-center gap-4 min-w-[250px]">
          <div className="text-3xl">🚗</div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Vehículo Activo</p>
            <p className="text-lg font-bold text-emerald-400">Toyota 4Runner</p>
          </div>
        </div>
      </div>

      {/* Cuadrícula de Categorías (Inicio) */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          Explorar Catálogo
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categorias.map((cat) => (
            <Link 
              key={cat.id} 
              to="/catalogo"
              className="bg-slate-900 border border-slate-800 hover:border-blue-500 hover:bg-slate-800/80 transition-all rounded-lg p-6 flex flex-col items-center justify-center gap-3 text-center cursor-pointer group"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">{cat.icono}</span>
              <span className="font-bold text-slate-300 group-hover:text-white text-sm">{cat.nombre}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}