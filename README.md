# RINN PRO 🚗⚙️

**RINN PRO** es una plataforma web moderna y escalable diseñada para la comercialización, gestión y validación de compatibilidad de repuestos automotrices. Construida con React, la aplicación ofrece una experiencia de usuario fluida mediante una arquitectura tolerante a fallos, gestión de estados complejos y un diseño altamente modular.

## 🚀 Características Principales

* **Sistema "Garage" de Compatibilidad:** Algoritmo de filtrado dinámico que asocia repuestos específicos con los modelos de vehículos del usuario, manteniendo la selección persistente en toda la navegación[cite: 6].
* **Gestor de Compras y Favoritos:** Sistema completo de carrito de compras con selector de métodos de entrega y lista de deseos, respaldado por un manejo de estado global eficiente (Context API)[cite: 5, 6].
* **Arquitectura Desacoplada:** Capa de servicios (`services/`) que abstrae toda la lógica de backend (actualmente Supabase), permitiendo migraciones de base de datos futuras sin afectar la capa de presentación[cite: 7].
* **Programación Defensiva (UI Resiliente):** Implementación de componentes preventivos (`FallbackImage`, `LoadingState`, `ErrorMessage`) y manejo seguro de almacenamiento local (`safeLocalStorage`) para garantizar que la interfaz no colapse ante fallos de red o recursos inexistentes[cite: 5].
* **Perfil de Usuario Integral:** Panel de administración de cuenta que incluye el garaje virtual del usuario, historial detallado de pedidos y gestión de sesiones[cite: 6].

## 🛠️ Stack Tecnológico

* **Core:** React 18, Vite.
* **Enrutamiento:** React Router DOM (v6+)[cite: 5].
* **Estilos:** Tailwind CSS v4 (PostCSS)[cite: 5].
* **Estado Global:** React Context API (Auth, Cart, Garage, Favorites, Search)[cite: 5, 6].
* **Backend / BaaS (Abstraído):** Supabase (Auth & Database)[cite: 7].

## 📂 Estructura del Proyecto

El proyecto sigue un patrón estricto de separación de responsabilidades para evitar anti-patrones como el *God Component* y *Mixed Concerns*:

```text
src/
├── context/      # Nubes de estado global (AuthContext, CartContext, etc.)
├── features/     # Lógica de negocio dividida por dominios (auth, catalogo, carrito, checkout, perfil)
├── hooks/        # Funciones reutilizables y custom hooks (useCatalogo, useRepuesto)
├── layout/       # Contenedores estructurales (MainLayout, TopNav)
├── services/     # Capa de desacoplamiento de base de datos (globalStoreSupabase, catalogService)
├── ui/           # Componentes visuales puros y resilientes (LoadingState, FallbackImage)
└── utils/        # Funciones auxiliares (safeLocalStorage)

