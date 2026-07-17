import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from './AuthContext';
import { safeLocalStorage } from '../utils/safeLocalStorage';

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
        const { data, error } = await supabase
          .from('vehiculos')
          .select('*')
          .order('marca', { ascending: true });

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
        const { data, error } = await supabase
          .from('usuario_vehiculo')
          .select('vehiculo_id, vehiculos(*)')
          .eq('usuario_id', user.id)
          .maybeSingle();

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
      if (vehiculo) {
        const { error } = await supabase
          .from('usuario_vehiculo')
          .upsert(
            { usuario_id: user.id, vehiculo_id: vehiculo.id },
            { onConflict: 'usuario_id' }
          );

        if (error) console.error(error);
      } else {
        const { error } = await supabase
          .from('usuario_vehiculo')
          .delete()
          .eq('usuario_id', user.id);

        if (error) console.error(error);
      }
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