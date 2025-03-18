import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import MainNavigation from "./components/MainNavigation";
import Banner from "./components/Banner";
import ProductCategories from "./components/ProductCategories";
import FeaturedBanner from "./components/FeaturedBanner";
import FeaturedProducts from "./components/FeaturedProducts";
import Footer from "./components/Footer";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import AuthPage from "./pages/AuthPage";
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
            <FeaturedProducts />
          </>
        } />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/AuthPage" element={<AuthPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
