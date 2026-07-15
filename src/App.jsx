import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PerfilView from './features/perfil/PerfilView';
import MainLayout from './layout/MainLayout';
import HomeView from './features/home/HomeView';
import CatalogoView from './features/catalogo/CatalogoView';
import RepuestoDetalleView from './features/catalogo/RepuestoDetalleView'; 
import CarritoView from './features/carrito/CarritoView';
import CheckoutSuccessView from './features/checkout/CheckoutSuccessView';
import FavoritosView from './features/favoritos/FavoritosView';
import AuthView from './features/auth/AuthView';
import ProtectedRoute from './features/auth/ProtectedRoute';
import { FavoritosProvider } from './context/FavoritosContext';
import { SearchProvider } from './context/SearchContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { GarageProvider } from './context/GarageContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider> 
        <GarageProvider>
          <FavoritosProvider>
            <BrowserRouter>
              <SearchProvider>
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<HomeView />} />
                    <Route path="/catalogo" element={<CatalogoView />} />
                    <Route path="/repuesto/:sku" element={<RepuestoDetalleView />} /> 
                    <Route path="/carrito" element={<CarritoView />} />
                    <Route path="/checkout/success" element={<CheckoutSuccessView />} />
                    <Route path="/auth" element={<AuthView />} />

                    <Route 
                      path="/favoritos" 
                      element={
                        <ProtectedRoute>
                          <FavoritosView />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/perfil" 
                      element={
                        <ProtectedRoute>
                          <PerfilView />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </MainLayout>
              </SearchProvider>
            </BrowserRouter>
          </FavoritosProvider>
        </GarageProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;