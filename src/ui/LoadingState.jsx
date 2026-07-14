// src/ui/LoadingState.jsx
export default function LoadingState({ mensaje = "Cargando catálogo..." }) {
  return (
    <div className="w-full flex flex-col items-center justify-center p-12 bg-slate-900/50 border border-slate-800 rounded-lg">
      <div className="relative w-12 h-12 mb-4">
        {/* Anillo estático de fondo */}
        <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
        {/* Anillo animado superior */}
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-slate-400 font-medium animate-pulse">{mensaje}</p>
    </div>
  );
}