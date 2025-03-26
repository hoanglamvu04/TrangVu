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
import AuthPage from "./pages/AuthPage";
import Category from "./pages/Category";
import CustomerProfile from "./pages/CustomerProfile";
import ProductDetail from "./pages/ProductDetail";

function App() {
  return (
    <Router>
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
        <Route path="/Cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/AuthPage" element={<AuthPage />} />
        <Route path="/Category" element={<Category />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/CustomerProfile" element={<CustomerProfile />} />
        <Route path="/order-management" element={<CustomerProfile />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
