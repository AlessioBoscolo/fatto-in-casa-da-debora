import React from "react";
import { useParams, Link } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Image from "../components/Image";
import Footer from "../components/Footer";

import { useAuth } from "../context/AuthContext";

const { apiUrl } = require("../config/apiConfig");

function RecipeDetails() {
  const { id_recipe } = useParams();
  const [RecipeDetails, setRecipeDetails] = React.useState({});
  const [Ingredients, setIngredients] = React.useState([]);
  const [porzioni, setPorzioni] = React.useState(1);

  React.useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(
          `${apiUrl}:3001/api/recipe/getRecipeDetails`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id_ricetta: id_recipe,
            }),
          }
        );

        if (response.ok) {
          const retrievedData = await response.json();
          setRecipeDetails(retrievedData.recipe);
          setIngredients(retrievedData.ingredients);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchRecipeDetails();
  }, [id_recipe]);

  React.useEffect(() => {
    if (RecipeDetails && RecipeDetails.porzioni_ricetta) {
      setPorzioni(Number(RecipeDetails.porzioni_ricetta) || 1);
    }
  }, [RecipeDetails]);

  const handlePorzioniChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setPorzioni(Math.max(1, value));
  };

  function writeIngredients() {
    return Object.entries(Ingredients).map(([key, field]) => {
      let quantity = '';
      if (field.nome_unita_misura !== "q.b." && field.quantita_ingrediente > 0) {
        const calculatedQuantity = (field.quantita_ingrediente / RecipeDetails.porzioni_ricetta) * porzioni;
        // Converti in stringa e rimuovi gli zeri non necessari dopo il decimale
        quantity = calculatedQuantity % 1 === 0 
          ? Math.round(calculatedQuantity).toString()
          : calculatedQuantity.toFixed(1).replace(/\.?0+$/, '');
      }

      return (
        <li key={key}>
          {quantity} {field.nome_unita_misura}{" "}
          <span className="font-bold">{field.nome_ingrediente}</span>
        </li>
      );
    });
  }

  const { user } = useAuth();


  return (
    <>
      <Navbar />
      <div className="md:w-[50%] w-[90%] relative mx-auto flex flex-col items-center">
        <p className="font-bold text-red-500 text-center text-3xl mb-4">
          {RecipeDetails.nome_ricetta}
        </p>
        <Image
          className="mt-4 rounded-lg w-full"
          src={RecipeDetails.image_path_ricetta}
          alt=""
        />

        <div className="grid md:grid-cols-2 grid-cols-1 w-full mt-16 gap-8">
          <div className="flex flex-col items-center">
            <p className="font-bold text-3xl mb-4">DOSI:</p>
            <input
              id="porzione"
              className="text-3xl w-16 focus:outline-none text-center"
              type="number"
              min="1"
              value={porzioni}
              onChange={handlePorzioniChange}
            />
          </div>
          <div className="flex flex-col items-center">
            <p className="font-bold text-3xl mb-4">INGREDIENTI</p>
            <ul className="">{writeIngredients()}</ul>
          </div>
        </div>

        <div className="w-full mt-8">
          <p className="text-2xl font-bold mb-4">PREPARAZIONE:</p>
          <p className="mb-8">
            {RecipeDetails.preparazione_ricetta
              ?.split("<br>")
              .map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
          </p>
        </div>

        <div className="w-full mb-8">
          {RecipeDetails.note_ricetta && (
            <p className="text-2xl font-bold mt-4 mb-4">NOTE:</p>
          )}
          {RecipeDetails.note_ricetta?.split("<br>").map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
        
        {user.permesso_utente > 1 && <Link to={`/ricetta/${id_recipe}/modifica`} className="btn bg-yellow-500 hover:bg-yellow-700 w-full md:w-auto mb-8">Modifica Ricetta</Link>}
      </div>
      <Footer />
    </>
  );
}

export default RecipeDetails;
