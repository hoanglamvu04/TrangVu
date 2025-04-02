import { Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Dashboard from './pages/Dashboard';
import ProductManager from './pages/ProductManager';
import OrderManager from './pages/OrderManager';
import UserManager from './pages/UserManager';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductManager />} />
        <Route path="orders" element={<OrderManager />} />
        <Route path="users" element={<UserManager />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
