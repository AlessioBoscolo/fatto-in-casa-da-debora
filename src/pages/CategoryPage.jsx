import React from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Cards from "../components/Cards/Cards";

const { apiUrl } = require('../config/apiConfig');

function CategoryPage() {
  const { id_categoria } = useParams();
  const [categoryName, setCategoryName] = React.useState([]);

  React.useEffect(() => {
    fetchNameCategory();
  }, [id_categoria]);

  const fetchNameCategory = async () => {
    try {
      const response = await fetch(
        `${apiUrl}:3001/api/category/getNameCategory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_categorias: id_categoria,
          }),
        }
      );

      if (response.ok) {
        const retrievedData = await response.json();
        setCategoryName(retrievedData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  return (
    <>
      <Navbar />
      <h1 className="mt-4 font-semibold text-center text-3xl text-red-500">
        {categoryName.length > 0
          ? categoryName[0].nome_categoria
          : "Caricamento..."}{" "}
      </h1>
      <Cards title="categoryPage" id_categoria={id_categoria} />
    </>
  );
}

export default CategoryPage;
