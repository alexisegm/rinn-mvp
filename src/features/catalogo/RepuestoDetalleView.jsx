import { useParams, Link } from 'react-router-dom';
import { useRepuesto } from '../../hooks/useRepuesto';
import LoadingState from '../../ui/LoadingState';
import ErrorMessage from '../../ui/ErrorMessage';
import { useFavoritos } from '../../context/FavoritosContext';
import { useCart } from '../../context/CartContext';
import { useGarage } from '../../context/GarageContext';
import DetalleRepuestoHeader from './components/DetalleRepuestoHeader';
import FichaRepuesto from './components/FichaRepuesto';
import DescripcionRepuesto from './components/DescripcionRepuesto';
import DisponibilidadRepuesto from './components/DisponibilidadRepuesto';

export default function RepuestoDetalleView() {
  const { sku } = useParams();
  const { vehiculoActivo } = useGarage();
  const { repuesto, esCompatible, isLoading, error } = useRepuesto(sku, vehiculoActivo?.id);
  const { toggleFavorito, isFavorito } = useFavoritos();
  const { agregarAlCarrito } = useCart();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto mt-8 w-full">
        <LoadingState mensaje={`Cargando detalles técnicos de ${sku}...`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto mt-8 w-full">
        <ErrorMessage mensaje={error} />
        <div className="mt-4 flex justify-center">
          <Link to="/catalogo" className="text-blue-400 hover:text-blue-300 underline font-medium">
            Volver al catálogo completo
          </Link>
        </div>
      </div>
    );
  }

  if (!repuesto) return null;

  const esFav = isFavorito(repuesto.id);

  const handleAgregarPedido = () => {
    agregarAlCarrito(repuesto, 1);
  };

  return (
    <div className="max-w-7xl mx-auto w-full pb-12">
      <DetalleRepuestoHeader sku={repuesto.sku} />
      <FichaRepuesto
        repuesto={repuesto}
        esCompatible={esCompatible}
        vehiculoActivo={vehiculoActivo}
        esFav={esFav}
        onToggleFavorito={() => toggleFavorito(repuesto)}
        onAgregarPedido={handleAgregarPedido}
      />
      <DescripcionRepuesto repuesto={repuesto} />
      <DisponibilidadRepuesto repuesto={repuesto} />
    </div>
  );
}