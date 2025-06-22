import React from "react";

import Navbar from "../components/Navbar/Navbar";
import Search from "../components/Search";
import Carousel from "../components/Carousel";
import Categories from "../components/Categories";
import Cards from "../components/Cards/Cards";
import Footer from "../components/Footer";

function Home() {
  return <><Navbar/><Search research="all"/><Carousel nrRandomRecipe="5" /><Categories/><Cards title="randomRecipe" nrRandomRecipe="3"/><Footer/></>;
}

export default Home;
