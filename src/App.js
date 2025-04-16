import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MainNavigation from "./components/MainNavigation";
import Banner from "./components/Banner";
import ProductCategories from "./components/ProductCategories";
import FeaturedBanner from "./components/FeaturedBanner";
import Footer from "./components/Footer";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Category from "./pages/Category";
import CustomerProfile from "./pages/CustomerProfile";
import ProductDetail from "./pages/ProductDetail";
import AdminRoutes from './admin'; 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        <Route path="*" element={
          <>
            <Header />
            <MainNavigation />
            <Routes>
              <Route path="/" element={
                <>
                  <Banner />
                  <ProductCategories />
                  <FeaturedBanner />
                </>
              } />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/category" element={<Category />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/CustomerProfile" element={<CustomerProfile />} />
              <Route path="/order-management" element={<CustomerProfile />} />
              <Route path="/address-management" element={<CustomerProfile />} />
              <Route path="/review-feedback" element={<CustomerProfile />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
