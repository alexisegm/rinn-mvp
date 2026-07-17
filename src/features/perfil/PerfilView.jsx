import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import GarageSelector from '../catalogo/components/GarageSelector';
import { ordersService } from '../../services/ordersService';
import ResumenPerfil from './components/ResumenPerfil';
import ListaOrdenes from './components/ListaOrdenes';

export default function PerfilView() {
  const { user } = useAuth();
  const [ordenes, setOrdenes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistorial = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await ordersService.getOrdersByUser(user.id);

        if (error) throw error;
        if (data) setOrdenes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistorial();
  }, [user?.id]);

  if (isLoading) {
    return <div className="text-center p-12 text-slate-400">Cargando tu perfil e historial...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <ResumenPerfil user={user} />

      <div className="mb-10">
        <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Mi Garage</h3>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <p className="text-slate-400 text-sm mb-4">
            Selecciona tu vehículo principal. El catálogo se filtrará automáticamente para mostrar solo repuestos compatibles con esta configuración.
          </p>
          <GarageSelector />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Historial de Pedidos</h3>

      {ordenes.length === 0 ? (
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-8 text-center text-slate-500 italic">
          Aún no has realizado ninguna compra en la plataforma.
        </div>
      ) : (
        <ListaOrdenes ordenes={ordenes} />
      )}
    </div>
  );
}