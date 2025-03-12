import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import MainNavigation from "./components/MainNavigation";
import Banner from "./components/Banner";
import FashionOffers from "./components/FashionOffers";
import ProductCategories from "./components/ProductCategories";
import FeaturedBanner from "./components/FeaturedBanner";
import FeaturedProducts from "./components/FeaturedProducts";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage"; 
function App() {
  return (
    <Router>
      <Header />
      <MainNavigation />
      <Routes>
        <Route path="/" element={
          <>
            <Banner />
            <FashionOffers />
            <ProductCategories />
            <FeaturedBanner />
            <FeaturedProducts />
          </>
        } />
        <Route path="/login" element={<LoginPage />} /> 
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
