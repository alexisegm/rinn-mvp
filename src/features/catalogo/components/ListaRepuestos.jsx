import RepuestoCard from './RepuestoCard';

export default function ListaRepuestos({ repuestos }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {repuestos.map((repuesto) => (
        <RepuestoCard
          key={repuesto.id}
          id={repuesto.id}
          sku={repuesto.sku}
          nombre={repuesto.nombre}
          precio={repuesto.precio}
          stock={repuesto.stock}
          imagenUrl={null}
        />
      ))}
    </div>
  );
}
