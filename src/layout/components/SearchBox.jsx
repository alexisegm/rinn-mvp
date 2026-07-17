export default function SearchBox({
  inputValue,
  onInputChange,
  onFocus,
  onBlur,
  onSubmit,
  showDropdown,
  historial,
  onHistoryClick,
  onClearHistory
}) {
  return (
    <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
      <form onSubmit={onSubmit} className="w-full relative">
        <input 
          type="text" 
          id="search-input"
          name="search-input"
          value={inputValue}
          onChange={onInputChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Buscar por repuesto, SKU o categoría..." 
          className="w-full bg-slate-800 border border-slate-700 text-slate-200 px-4 py-2 rounded focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button type="submit" className="absolute right-2 top-2 text-slate-400 hover:text-blue-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
      </form>

      {showDropdown && historial.length > 0 && (
        <div className="absolute top-full left-0 mt-1 w-full bg-slate-800 border border-slate-700 rounded-md shadow-2xl z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Últimas Búsquedas</span>
            <button 
              onMouseDown={(e) => { e.preventDefault(); onClearHistory(); }} 
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Limpiar
            </button>
          </div>
          <ul className="max-h-48 overflow-y-auto">
            {historial.map((item, index) => (
              <li key={index}>
                <button 
                  onMouseDown={(e) => { e.preventDefault(); onHistoryClick(item); }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="text-slate-500 text-lg">🕒</span> {item}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
