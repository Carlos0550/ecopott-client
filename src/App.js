import { Routes, Route, Navigate } from 'react-router-dom';
import AdminPage from './pages/Administracion/AdminPage';
import ViewProducts from './pages/Administracion/VerTodosLosProductos/ViewProducts';
import PromotionsManager from './pages/Administracion/PromosManager/PromotionsManager';
import Login from './pages/Login/Login';
import Settings from './pages/Administracion/Ajustes/Settings';
import Home from './pages/Clientes/Home';
import { useAuthContext } from './AuthContext';
import ProductView from "./pages/Clientes/Componentes/DetallesDelProducto/ProductView"

function App() {
  const { isAuthenticated, isAdmin } = useAuthContext();
  return (
    <Routes>
      

      {/* Ruta de login */}
      <Route path="/login" element={<Login />} />

      {/* Redirección si no está autenticado */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            isAdmin ? <AdminPage /> : <Navigate to="/home" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/view_products/*"
        element={
          isAuthenticated ? (
            isAdmin ? <ViewProducts /> : <Navigate to="/home" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/promotions"
        element={
          isAuthenticated ? (
            isAdmin ? <PromotionsManager /> : <Navigate to="/home" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/settings"
        element={
          isAuthenticated ? (
            isAdmin ? <Settings /> : <Navigate to="/home" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Ruta pública */}
      <Route path="/home/*" element={<Home />} />
      <Route path='/view_products-details/:productId' element={<ProductView/>}/>
      </Routes>
  );
}

export default App;
