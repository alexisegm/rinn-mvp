// src/ui/ErrorMessage.jsx
export default function ErrorMessage({ 
  titulo = "Ocurrió un error", 
  mensaje = "No pudimos procesar tu solicitud en este momento.",
  onRetry 
}) {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 bg-red-950/20 border border-red-900/50 rounded-lg text-center">
      <div className="text-4xl mb-3">⚠️</div>
      <h3 className="text-lg font-bold text-red-400 mb-1">{titulo}</h3>
      <p className="text-sm text-slate-400 mb-6 max-w-md">{mensaje}</p>
      
      {/* RetryButton Condicional: Solo se muestra si le pasamos una función de reintento */}
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium border border-slate-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Reintentar conexión
        </button>
      )}
    </div>
  );
}