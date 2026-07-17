import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFavoritos } from '../context/FavoritosContext';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function TopNav() {
  const { favoritos } = useFavoritos();
  const { searchTerm, ejecutarBusqueda, historial, limpiarHistorial } = useSearch();
  const { user, logout } = useAuth();
  
  const { totalItems } = useCart(); 
  const navigate = useNavigate();
  
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    ejecutarBusqueda(inputValue);
    setShowDropdown(false);
  };

  const handleHistoryClick = (termino) => {
    setInputValue(termino);
    ejecutarBusqueda(termino);
    setShowDropdown(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">R</div>
          <span className="text-xl font-black tracking-tighter text-white">
            RINN <span className="text-blue-500">PRO</span>
          </span>
        </Link>

        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
          <form onSubmit={handleSubmit} className="w-full relative">
            <input 
              type="text" 
              id="search-input"
              name="search-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
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
                  onMouseDown={(e) => { e.preventDefault(); limpiarHistorial(); }} 
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Limpiar
                </button>
              </div>
              <ul className="max-h-48 overflow-y-auto">
                {historial.map((item, index) => (
                  <li key={index}>
                    <button 
                      onMouseDown={(e) => { e.preventDefault(); handleHistoryClick(item); }}
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

        <div className="flex items-center gap-4 sm:gap-6">
          <Link 
            to="/catalogo" 
            className="text-slate-300 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
            <span className="hidden sm:inline">Catálogo</span>
          </Link>

          <Link 
            to="/favoritos" 
            className="text-slate-300 hover:text-white flex items-center gap-2 text-sm font-medium relative transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            <span className="hidden sm:inline">Favoritos</span>
            {favoritos.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900">
                {favoritos.length}
              </span>
            )}
          </Link>

          <Link 
            to="/carrito" 
            className="text-slate-300 hover:text-white flex items-center gap-2 text-sm font-medium relative transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span className="hidden sm:inline">Carrito</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900">
                {totalItems}
              </span>
            )}
          </Link>
          
          {user ? (
            <div className="relative border-l border-slate-700 pl-4 sm:pl-6" ref={userMenuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
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
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    Mi Perfil
                  </Link>
                  <button 
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </nav>
  );
}