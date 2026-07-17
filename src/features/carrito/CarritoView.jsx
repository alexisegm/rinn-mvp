import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { catalogService } from '../../services/catalogService';
import CarritoVacio from './components/CarritoVacio';
import ListaRepuestosCarrito from './components/ListaRepuestosCarrito';
import ResumenEntrega from './components/ResumenEntrega';

export default function CarritoView() {
  const { carrito, eliminarDelCarrito, actualizarCantidad, limpiarCarrito, totalItems, totalPrecio, procesarOrden } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [enviando, setEnviando] = useState(false);
  const [tipoEntrega, setTipoEntrega] = useState('envio'); // 'envio' o 'retiro'
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState('');
  const [tiendas, setTiendas] = useState([]);
  
  const costoEnvio = tipoEntrega === 'envio' ? 10.00 : 0;
  const totalFinal = totalPrecio + costoEnvio;

  // Cargar tiendas desde Supabase
  useEffect(() => {
    const fetchTiendas = async () => {
      const { data, error } = await catalogService.getTiendas();
      if (!error && data) {
        setTiendas(data);
      }
    };
    fetchTiendas();
  }, []);

  const handlePagar = async () => {
    if (!user) {
      alert("Debes iniciar sesión para poder procesar tu pedido.");
      navigate('/auth');
      return;
    }

    if (tipoEntrega === 'retiro' && !sucursalSeleccionada) {
      alert("Por favor, selecciona una sucursal para el retiro.");
      return;
    }

    try {
      setEnviando(true);

      // Preparamos los nuevos datos de envío para la base de datos
      const datosEnvio = {
        tipo_entrega: tipoEntrega,
        sucursal_id: tipoEntrega === 'retiro' ? sucursalSeleccionada : null,
      };

      // Nota: procesarOrden ya está configurado en el Context para recibir estos datos y el total actualizado
      const ordenIdGenerado = await procesarOrden(user.id, datosEnvio, totalFinal);
      
      if (ordenIdGenerado) {
        navigate('/checkout/success', { 
          state: { ordenId: ordenIdGenerado } 
        });
      } else {
        alert("Hubo un problema al procesar la orden. Inténtalo de nuevo.");
      }
      
    } catch (error) {
      console.error("Error al procesar la orden:", error);
      alert("Hubo un problema crítico al registrar tu pedido.");
    } finally {
      setEnviando(false);
    }
  };

  if (carrito.length === 0) {
    return <CarritoVacio />;
  }

  return (
    <div className="max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-white mb-8">Resumen de tu Pedido</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <ListaRepuestosCarrito
          carrito={carrito}
          enviando={enviando}
          actualizarCantidad={actualizarCantidad}
          eliminarDelCarrito={eliminarDelCarrito}
          limpiarCarrito={limpiarCarrito}
        />

        <ResumenEntrega
          tipoEntrega={tipoEntrega}
          setTipoEntrega={setTipoEntrega}
          sucursalSeleccionada={sucursalSeleccionada}
          setSucursalSeleccionada={setSucursalSeleccionada}
          tiendas={tiendas}
          totalPrecio={totalPrecio}
          costoEnvio={costoEnvio}
          totalFinal={totalFinal}
          enviando={enviando}
          onPagar={handlePagar}
        />
      </div>
    </div>
  );
}