import { Link } from 'react-router-dom';

export default function UserMenu({ user, isUserMenuOpen, onToggleMenu, onCloseMenu, onLogout, menuRef }) {
  if (!user) {
    return (
      <div className="border-l border-slate-700 pl-4 sm:pl-6">
        <Link 
          to="/auth" 
          className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 sm:px-4 sm:py-1.5 rounded transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
          </svg>
          <span className="hidden sm:inline">Ingresar</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative border-l border-slate-700 pl-4 sm:pl-6" ref={menuRef}>
      <button 
        onClick={onToggleMenu}
        className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        <span className="hidden sm:inline text-sm font-medium">Cuenta</span>
      </button>

      {isUserMenuOpen && (
        <div className="absolute right-0 mt-3 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-2xl py-1 z-50">
          <div className="px-4 py-3 border-b border-slate-700">
            <p className="text-xs text-slate-400">Sesión iniciada</p>
            <p className="text-sm font-bold text-white truncate">{user.email}</p>
          </div>
          <Link 
            to="/perfil" 
            onClick={onCloseMenu}
            className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            Mi Perfil
          </Link>
          <button 
            onClick={() => {
              onCloseMenu();
              onLogout();
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}
