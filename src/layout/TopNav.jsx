import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFavoritos } from '../context/FavoritosContext';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SearchBox from './components/SearchBox';
import UserMenu from './components/UserMenu';

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

        <SearchBox
          inputValue={inputValue}
          onInputChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          onSubmit={handleSubmit}
          showDropdown={showDropdown}
          historial={historial}
          onHistoryClick={handleHistoryClick}
          onClearHistory={limpiarHistorial}
        />

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
          
          <UserMenu
            user={user}
            isUserMenuOpen={isUserMenuOpen}
            onToggleMenu={() => setIsUserMenuOpen(!isUserMenuOpen)}
            onCloseMenu={() => setIsUserMenuOpen(false)}
            onLogout={handleLogout}
            menuRef={userMenuRef}
          />
        </div>
      </div>
    </nav>
  );
}