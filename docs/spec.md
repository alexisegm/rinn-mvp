# Especificaciones Técnicas (Spec) - RINN PRO

## 1. Descripción General
RINN PRO es una plataforma web orientada a la gestión y comercialización de repuestos automotrices. Su objetivo es proporcionar una experiencia de usuario fluida, desde la exploración del catálogo hasta la gestión de un carrito de compras y la validación de compatibilidad de piezas con vehículos específicos. Todo esto bajo una interfaz tolerante a fallos, altamente modular y con persistencia de estado y autenticación centralizada.

## 2. Stack Tecnológico
* **Entorno de Desarrollo:** Node.js y configuración moderna con Vite[cite: 5].
* **Librería Core:** React[cite: 5].
* **Enrutamiento:** React Router (react-router-dom)[cite: 5].
* **Estilos:** Tailwind CSS configurado mediante PostCSS (postcss.config.js)[cite: 5].
* **Base de Datos / Backend (Desacoplado):** Supabase (gestión de tablas de inventario, órdenes, favoritos, sistema_garage y asociación cruzada)[cite: 6, 7].
* **Gestión de Estado Global:** React Context API (implementado a través de `AuthContext`, `CartContext`, `FavoritosContext`, `GarageContext` y `SearchContext`) para erradicar el Prop Drilling[cite: 5, 6].
* **Almacenamiento:** Persistencia local manejada mediante la utilidad `safeLocalStorage.js`[cite: 5].

## 3. Arquitectura y Estructura Modular
La aplicación implementa un patrón estricto de separación de responsabilidades (*Separation of Concerns*) y erradicación de anti-patrones como el *God Component* y *Mixed Concerns*[cite: 8, 9, 10]:

* **Esqueleto Base:** Estructuración de directorios que separa de forma estricta los contenedores estructurales (`layout`), componentes visuales reutilizables (`ui`), lógica de negocio (`features`), funciones personalizadas (`hooks`) y el estado global de la aplicación (`context`)[cite: 5].
* **Capa de Servicios (Desacoplamiento Backend):** Implementación de la carpeta `services` que centraliza el acceso a la base de datos a través de `globalStoreSupabase.js` (operaciones CRUD abstractas) y servicios especializados (`authService.js`, `catalogService.js`, `ordersService.js`, `favoritesService.js`, `garageService.js`)[cite: 7]. Esto garantiza que contextos, hooks y vistas no estén acoplados directamente al SDK de Supabase[cite: 7].
* **Patrón Orquestador en Vistas Críticas:** Las vistas principales actúan únicamente como orquestadores lógicos y delegan el renderizado visual a subcomponentes más pequeños y enfocados[cite: 9, 10]. Por ejemplo:
  * `CarritoView` delega en `CarritoVacio`, `ListaRepuestosCarrito` y `ResumenEntrega`[cite: 8].
  * `CatalogoView` delega en `CatalogoHeaderBanner` y `CatalogoResultados`[cite: 9, 10].
  * `RepuestoDetalleView` delega en `DetalleProductoPrincipal`, `DetalleProductoInfo` y `DisponibilidadRepuesto`[cite: 9, 10].
  * `PerfilView` delega en `PerfilHeader`, `ResumenPerfil`, e `HistorialPedidos`/`ListaOrdenes`[cite: 9, 10].

## 4. Requerimientos de Funcionalidad y UX
* **Gestión de Fallos (Defensive Programming):** Implementación de componentes visuales resilientes como `LoadingState`, `ErrorMessage` y `EmptyState` para el manejo preventivo de errores y procesos asíncronos[cite: 5].
* **Carga Segura de Assets:** Uso del componente inteligente `FallbackImage` para garantizar una respuesta visual sólida frente a imágenes rotas o faltantes, evitando la degradación de la UI[cite: 5].
* **Navegación y Autenticación Centralizada:** `TopNav` actúa como el centro neurálgico de la interfaz, incluyendo el buscador dinámico `SearchBox`, `UserMenu` para el control de sesiones y los indicadores globales de estado (carrito y favoritos) optimizados con un enfoque híbrido para dispositivos móviles[cite: 6, 8]. Rutas protegidas a través de `ProtectedRoute`[cite: 5].
* **Compatibilidad Transversal:** El sistema de "Garage" cruza de manera dinámica la compatibilidad individual del repuesto con el modelo del vehículo seleccionado por el usuario[cite: 6]. Esta selección tiene persistencia y sincronización total entre el inicio (`HomeView`), el catálogo (`CatalogoView` y `SidebarFiltros`) y el perfil del usuario (`PerfilView`)[cite: 6].