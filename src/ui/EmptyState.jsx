// src/ui/EmptyState.jsx
export default function EmptyState({ 
  titulo = "No hay resultados", 
  mensaje = "No se encontraron elementos con estos criterios.",
  icono = "📭"
}) {
  return (
    <div className="w-full flex flex-col items-center justify-center p-12 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-lg text-center">
      <div className="text-5xl mb-4 opacity-40">{icono}</div>
      <h3 className="text-lg font-bold text-slate-300 mb-2">{titulo}</h3>
      <p className="text-sm text-slate-500 max-w-md">{mensaje}</p>
    </div>
  );
}