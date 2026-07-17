// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    authService.getSession().then(({ session }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoadingAuth(false);
    });

    const { subscription } = authService.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoadingAuth(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Funciones de conveniencia para usar en nuestros componentes
  const login = async (email, password) => {
    const { data, error } = await authService.signIn(email, password);
    if (error) throw error;
    return data;
  };

  const register = async (email, password) => {
    const { data, error } = await authService.signUp(email, password);
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await authService.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoadingAuth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}