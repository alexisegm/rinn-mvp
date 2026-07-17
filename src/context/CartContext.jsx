import { createContext, useState, useEffect, useContext } from 'react';
import { safeLocalStorage } from '../utils/safeLocalStorage';
import { ordersService } from '../services/ordersService';

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
      const { data: orden, error } = await ordersService.createOrder({
        usuarioId,
        datosEnvio,
        totalFinal,
        carrito
      });

      if (error) throw error;

      setCarrito([]);
      return orden.id;
    } catch (error) {
      console.error('Error:', error);
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