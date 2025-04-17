import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MainNavigation from "./components/MainNavigation";
import Banner from "./components/Banner";
import ProductCategories from "./components/ProductCategories";
import FeaturedBanner from "./components/FeaturedBanner";
import Footer from "./components/Footer";
import Category from "./pages/Category";
import CustomerProfile from "./pages/CustomerProfile";
import ProductDetail from "./pages/ProductDetail";
import AdminRoutes from "./admin";
import { CartProvider } from "../src/contexts/CartContext";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <Router>
      <CartProvider> {/* ✅ Bọc toàn bộ app với context giỏ hàng */}
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* Public Pages */}
          <Route
            path="*"
            element={
              <>
                <Header />
                <MainNavigation />
                <Routes>
                  <Route
                    path="/"
                    element={
                      <>
                        <Banner />
                        <ProductCategories />
                        <FeaturedBanner />
                      </>
                    }
                  />
                  <Route path="/category/:categoryCode" element={<Category />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/CustomerProfile" element={<CustomerProfile />} />
                  <Route path="/order-management" element={<CustomerProfile />} />
                  <Route path="/address-management" element={<CustomerProfile />} />
                  <Route path="/review-feedback" element={<CustomerProfile />} />
                  <Route path="/checkout" element={<Checkout />} />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
