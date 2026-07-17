import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { safeLocalStorage } from '../utils/safeLocalStorage';
import { garageService } from '../services/garageService';

const GarageContext = createContext();

export function GarageProvider({ children }) {
  const { user } = useAuth();
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);
  const [vehiculoActivo, setVehiculoActivoState] = useState(() => {
    return safeLocalStorage.getItem('rinn_garage_activo', null);
  });
  const [isLoadingGarage, setIsLoadingGarage] = useState(true);

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const { data, error } = await garageService.getVehiculos();
        if (error) throw error;
        if (data) setVehiculosDisponibles(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVehiculos();
  }, []);

  useEffect(() => {
    const cargarVehiculoGuardado = async () => {
      if (!user?.id) {
        setIsLoadingGarage(false);
        return;
      }

      try {
        setIsLoadingGarage(true);
        const { data, error } = await garageService.getVehiculoActivo(user.id);

        if (error) {
          console.error(error);
        }

        if (data?.vehiculos) {
          setVehiculoActivoState(data.vehiculos);
          safeLocalStorage.setItem('rinn_garage_activo', data.vehiculos);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingGarage(false);
      }
    };

    cargarVehiculoGuardado();
  }, [user?.id]);

  const seleccionarVehiculo = async (vehiculo) => {
    setVehiculoActivoState(vehiculo);
    safeLocalStorage.setItem('rinn_garage_activo', vehiculo);

    if (user?.id) {
      const { error } = await garageService.selectVehiculo(user.id, vehiculo);
      if (error) console.error(error);
    }
  };

  const limpiarGarage = () => {
    seleccionarVehiculo(null);
  };

  return (
    <GarageContext.Provider value={{ 
      vehiculosDisponibles, 
      vehiculoActivo, 
      seleccionarVehiculo, 
      limpiarGarage,
      isLoadingGarage
    }}>
      {children}
    </GarageContext.Provider>
  );
}

export function useGarage() {
  return useContext(GarageContext);
}