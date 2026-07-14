// src/features/auth/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingState from '../../ui/LoadingState';

export default function ProtectedRoute({ children }) {
  const { user, isLoadingAuth } = useAuth();

  // 1. Si la autenticación aún se está verificando, mostramos carga
  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingState mensaje="Verificando credenciales..." />
      </div>
    );
  }

  // 2. Si no hay usuario, lo redirigimos a la vista de Auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // 3. Si todo está en orden, renderizamos el componente hijo
  return children;
}