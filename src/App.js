import React from "react";
import Header from "./components/Header";
import MainNavigation from "./components/MainNavigation";
import Banner from "./components/Banner";
import FashionOffers from "./components/FashionOffers";
import ProductCategories from"./components/ProductCategories";
import FeaturedBanner from "./components/FeaturedBanner";
import FeaturedProducts from "./components/FeaturedProducts";
function App() {
  return (
    <div>
      <Header />
      <MainNavigation />
      <Banner />
      <FashionOffers />
      <ProductCategories />
      <FeaturedBanner />
      <FeaturedProducts />
    </div>
  );
  
}

export default App;
