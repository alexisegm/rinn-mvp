// src/layout/MainLayout.jsx
import TopNav from './TopNav';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      {/* Barra de Navegación Inyectada */}
      <TopNav />
      
      {/* Contenedor dinámico del Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 flex gap-6">
        {children}
      </main>
    </div>
  );
}