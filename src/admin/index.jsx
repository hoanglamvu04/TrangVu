import { Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Dashboard from './pages/Dashboard';
import ProductManager from './pages/ProductManager';
import OrderManager from './pages/OrderManager';
import UserManager from './pages/UserManager';
import CategoryManager from './pages/CategoryManager';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="categories" element={<CategoryManager />} />
        <Route path="products" element={<ProductManager />} />
        <Route path="order-manager" element={<OrderManager />} />
        <Route path="users" element={<UserManager />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
