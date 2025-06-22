import React from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Cards from "../components/Cards/Cards";
import Footer from "../components/Footer";

function SearchResults() {
  const { query } = useParams();
  const location = useLocation();  
  
  return (
    <>
      <Navbar />
      <h1 className="mt-4 font-semibold text-center text-3xl text-red-500">Risultati per: {query}</h1>
      <Cards title="search" elementToSearch={query} typeResearch={location.state.research} categoryIntoResearch={location.state.categoryIntoSearch}/>
      <Footer />
    </>
  );
}

export default SearchResults;
