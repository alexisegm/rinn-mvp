// src/context/GarageContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../config/supabase';
import { safeLocalStorage } from '../utils/safeLocalStorage';

const GarageContext = createContext();

export function GarageProvider({ children }) {
  // Lista de todos los vehículos disponibles en la base de datos
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);
  
  // El vehículo que el usuario tiene seleccionado actualmente
  const [vehiculoActivo, setVehiculoActivo] = useState(() => {
    return safeLocalStorage.getItem('rinn_garage_activo', null);
  });

  // Efecto para buscar los vehículos desde Supabase al cargar la app
  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const { data, error } = await supabase
          .from('vehiculos')
          .select('*')
          .order('marca', { ascending: true }); // Ordenados alfabéticamente

        if (error) throw error;
        if (data) setVehiculosDisponibles(data);
      } catch (error) {
        console.error("Error cargando vehículos del garage:", error);
      }
    };

    fetchVehiculos();
  }, []);

  // Efecto para persistir el vehículo seleccionado en localStorage
  useEffect(() => {
    safeLocalStorage.setItem('rinn_garage_activo', vehiculoActivo);
  }, [vehiculoActivo]);

  // Funciones de control
  const seleccionarVehiculo = (vehiculo) => {
    setVehiculoActivo(vehiculo);
  };

  const limpiarGarage = () => {
    setVehiculoActivo(null);
  };

  return (
    <GarageContext.Provider value={{ 
      vehiculosDisponibles, 
      vehiculoActivo, 
      seleccionarVehiculo, 
      limpiarGarage 
    }}>
      {children}
    </GarageContext.Provider>
  );
}

export function useGarage() {
  return useContext(GarageContext);
}