// src/context/SearchContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { safeLocalStorage } from '../utils/safeLocalStorage';
import { useNavigate } from 'react-router-dom';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  // Estado para la búsqueda actual
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado para el historial, inicializado desde el localStorage
  const [historial, setHistorial] = useState(() => {
    return safeLocalStorage.getItem('rinn_historial_busqueda', []);
  });

  // Herramienta de React Router para cambiar de página mediante código
  const navigate = useNavigate();

  // Guardar el historial silenciosamente cada vez que cambie
  useEffect(() => {
    safeLocalStorage.setItem('rinn_historial_busqueda', historial);
  }, [historial]);

  // Función principal: Ejecuta la búsqueda y actualiza el historial
  const ejecutarBusqueda = (termino) => {
    const busquedaLimpia = termino.trim();
    setSearchTerm(busquedaLimpia);
    
    // Si la búsqueda no está vacía, la guardamos en el historial
    if (busquedaLimpia !== "") {
      setHistorial((prev) => {
        // Evitamos duplicados eliminando la búsqueda si ya existía
        const historialSinDuplicados = prev.filter(
          item => item.toLowerCase() !== busquedaLimpia.toLowerCase()
        );
        // Colocamos la nueva búsqueda al principio y mantenemos solo las últimas 5
        return [busquedaLimpia, ...historialSinDuplicados].slice(0, 5);
      });
    }

    // Si el usuario busca desde el "Inicio", lo enviamos automáticamente al catálogo
    if (window.location.pathname !== '/catalogo') {
      navigate('/catalogo');
    }
  };

  const limpiarHistorial = () => {
    setHistorial([]);
  };

  return (
    <SearchContext.Provider value={{ searchTerm, ejecutarBusqueda, historial, limpiarHistorial }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}