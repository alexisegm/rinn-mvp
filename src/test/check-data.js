// src/test/check-data.js
import { supabase } from '../config/supabase.js';

async function testConnection() {
  console.log("Conectando a Supabase...");
  
  const { data, error } = await supabase
    .from('repuestos')
    .select('id, nombre, sku');

  if (error) {
    console.error("Error al conectar:", error.message);
  } else {
    console.log("¡Conexión exitosa!");
    console.log(`Se han encontrado ${data.length} repuestos en la base de datos.`);
    console.table(data); // Esto mostrará los datos en una tabla legible
  }
}

testConnection();