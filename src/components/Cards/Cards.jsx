import React from "react";

import Card from "./Card";

const { apiUrl } = require('../../config/apiConfig');


function Cards(props) {
  const id_categoria = props.id_categoria;
  const [functChoose, setFunctChoose] = React.useState([]);


  React.useEffect(() => {
    switch (props.title) {
      case "categoryPage":
        fetchRecipe();
        break;
      case "randomRecipe":
        fetchRandomRecipe();
        break;
    }
  }, [props.title, id_categoria, props.nrRandomRecipe]);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(
        `${apiUrl}:3001/api/category/getRecipe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_categoria: id_categoria,
          }),
        }
      );

      if (response.ok) {
        const retrievedData = await response.json();
        setFunctChoose(retrievedData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchRandomRecipe = async () => {
    try {
      const response = await fetch(
        `${apiUrl}:3001/api/category/getRandomRecipe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nrRandomRecipe: props.nrRandomRecipe,
          }),
        }
      );

      if (response.ok) {
        const retrievedData = await response.json();
        setFunctChoose(retrievedData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  function writeCards() {
    return Object.entries(functChoose).map(([key, field]) => (
      <Card
        key={key}
        title={field.nome_ricetta}
        src={field.image_path_ricetta}
        desc=""
      />
    ));
  }

  return (
    <div className="mt-24 flex flex-row justify-center items-center">
      <div className="w-9/12 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {writeCards()}
      </div>
    </div>
  );
}

export default Cards;
