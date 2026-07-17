import { createContext, useState, useEffect, useContext } from 'react';
import { safeLocalStorage } from '../utils/safeLocalStorage';
import { supabase } from '../config/supabase';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState(() => {
    return safeLocalStorage.getItem('rinn_carrito', []);
  });

  useEffect(() => {
    safeLocalStorage.setItem('rinn_carrito', carrito);
  }, [carrito]);

  const agregarAlCarrito = (repuesto, cantidad = 1) => {
    setCarrito((prev) => {
      const itemExiste = prev.find((item) => item.id === repuesto.id);
      
      if (itemExiste) {
        const nuevaCantidad = Math.min(itemExiste.cantidad + cantidad, repuesto.stock);
        return prev.map((item) => 
          item.id === repuesto.id ? { ...item, cantidad: nuevaCantidad } : item
        );
      }
      
      return [...prev, { ...repuesto, cantidad }];
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    setCarrito((prev) => prev.map((item) => {
      if (item.id === id) {
        return { ...item, cantidad: Math.min(nuevaCantidad, item.stock) };
      }
      return item;
    }));
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  // Se añade el parámetro totalFinal para reflejar costos de envío
  const procesarOrden = async (usuarioId, datosEnvio = {}, totalFinal) => {
    try {
      // Si no viene un totalFinal, recalculamos el base como salvaguarda
      const totalSeguro = totalFinal || carrito.reduce((sum, item) => sum + (parseFloat(item.precio) * item.cantidad), 0);

      const { data: orden, error: ordenError } = await supabase
        .from('ordenes')
        .insert({ 
          usuario_id: usuarioId,
          total: totalSeguro,
          estado: 'pendiente',
          ...datosEnvio // Aquí se inyectan tipo_entrega y sucursal_id
        })
        .select()
        .single();
        
      if (ordenError) throw ordenError;

      const detalles = carrito.map(item => ({
        orden_id: orden.id,
        repuesto_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: parseFloat(item.precio)
      }));

      const { error: detallesError } = await supabase
        .from('orden_detalles')
        .insert(detalles);

      if (detallesError) throw detallesError;

      setCarrito([]);
      
      return orden.id; 

    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
  const totalPrecio = carrito.reduce((total, item) => total + (parseFloat(item.precio) * item.cantidad), 0);

  return (
    <CartContext.Provider value={{ 
      carrito, 
      agregarAlCarrito, 
      eliminarDelCarrito,
      actualizarCantidad,
      limpiarCarrito,
      procesarOrden,
      totalItems,
      totalPrecio
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}