import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Image from "../components/Image";
import Footer from "../components/Footer";

import { showToast } from "../components/Toast/Toast";

const { apiUrl } = require("../config/apiConfig");

function UpdateRecipe() {
  const navigate = useNavigate();

  const { id_recipe } = useParams();

  const [RecipeDetails, setRecipeDetails] = React.useState({});
  const [Ingredients, setIngredients] = React.useState([]);
  const [porzioni, setPorzioni] = React.useState(1);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [UoM, setUoM] = React.useState([]);

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

  const fetchUoM = async () => {
    try {
      const response = await fetch(`${apiUrl}:3001/api/recipe/getUoM`);
      const data = await response.json();
      setUoM(data);
    } catch (error) {
      console.error("Errore nel caricamento degli ingredienti:", error);
    }
  };

  React.useEffect(() => {
    fetchUoM();
  }, []);

  function writeIngredients() {
    return Object.entries(Ingredients).map(([key, field]) => (
      <li key={key} className="mb-2 flex items-center gap-2 flex-wrap">
        {editingIngredient === key ? (
          <>
            <input
              type="number"
              className="w-16 md:w-20 border rounded px-2"
              value={field.quantita_ingrediente || ""}
              onChange={(e) => {
                const newIngredients = [...Ingredients];
                newIngredients[key] = {
                  ...field,
                  quantita_ingrediente: parseFloat(e.target.value) || 0,
                };
                setIngredients(newIngredients);
              }}
            />
            <select
              className="w-24 md:w-auto border rounded px-2"
              value={field.id_unita_misura}
              onChange={(e) => {
                const selectedUoM = UoM.find(
                  (u) => u.id_unita_misura === parseInt(e.target.value)
                );
                const newIngredients = [...Ingredients];
                newIngredients[key] = {
                  ...field,
                  id_unita_misura: parseInt(e.target.value),
                  nome_unita_misura: selectedUoM
                    ? selectedUoM.nome_unita_misura
                    : field.nome_unita_misura,
                };
                setIngredients(newIngredients);
              }}
            >
              {Array.isArray(UoM) &&
                UoM.map((item, i) => (
                  <option key={i} value={item.id_unita_misura}>
                    {item.nome_unita_misura}
                  </option>
                ))}
            </select>
            <input
              type="text"
              className="flex-1 min-w-[120px] border rounded px-2"
              value={field.nome_ingrediente}
              onChange={(e) => {
                const newIngredients = [...Ingredients];
                newIngredients[key] = {
                  ...field,
                  nome_ingrediente: e.target.value,
                };
                setIngredients(newIngredients);
              }}
            />
            <button
              onClick={() => setEditingIngredient(null)}
              className="bg-green-500 text-white px-2 py-1 rounded"
            >
              ✓
            </button>
          </>
        ) : (
          <>
            {field.nome_unita_misura !== "q.b." &&
              field.quantita_ingrediente > 0 &&
              field.quantita_ingrediente}{" "}
            {field.nome_unita_misura}{" "}
            <span className="font-bold">{field.nome_ingrediente}</span>
            <button
              onClick={() => setEditingIngredient(key)}
              className="ml-2 text-blue-500"
            >
              ✎
            </button>
          </>
        )}
      </li>
    ));
  }

  const handleTextAreaResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  React.useEffect(() => {
    const textareas = document.querySelectorAll("textarea");
    textareas.forEach((textarea) => {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    });
  }, [RecipeDetails]);

  const handleTextAreaChange = (e, field) => {
    handleTextAreaResize(e);
    setRecipeDetails((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const saveUpdate = async () => {
    try {
      const response = await fetch(
        `${apiUrl}:3001/api/recipe/saveUpdateRecipe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_ricetta: id_recipe,
            porzioni_recipe: porzioni,
            ingredienti_recipe: Ingredients,
            recipe_details: RecipeDetails,
          }),
        }
      );

      if (response.ok) {
        showToast("success", "Ricetta aggiornata con successo!");
        navigate(`/ricetta/${id_recipe}`);
      }
    } catch (error) {
      showToast("error", "Errore nell'aggiornamento della ricetta");
      console.error("Error:", error);
    }
  };

  const deleteRecipe = async () => {
    try {
      const response = await fetch(
        `${apiUrl}:3001/api/recipe/deleteRecipe`,
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
        showToast("success", "Ricetta eliminata con successo!");
        navigate(`/home`);
      }
    } catch (error) {
      showToast("error", "Errore nell'eliminazione della ricetta");
      console.error("Error:", error);
    }
  };


  return (
    <>
      <Navbar />
      <div className="w-[95%] md:w-[70%] lg:w-[50%] relative mx-auto flex flex-col items-center px-4">
        <input
          className="font-bold text-red-500 text-center text-2xl md:text-3xl mb-4 w-full border"
          value={RecipeDetails.nome_ricetta || ''}
          onChange={(e) => setRecipeDetails(prev => ({
            ...prev,
            nome_ricetta: e.target.value
          }))}
        />

        <input
          className="w-full mb-4 p-2 border rounded"
          value={RecipeDetails.image_path_ricetta || ''}
          onChange={(e) => setRecipeDetails(prev => ({
            ...prev,
            image_path_ricetta: e.target.value
          }))}
          placeholder="URL dell'immagine"
        />

        <Image
          className="mt-4 rounded-lg w-full"
          src={RecipeDetails.image_path_ricetta}
          alt=""
        />

        <div className="grid grid-cols-1 md:grid-cols-2 w-full mt-8 md:mt-16 gap-4 md:gap-8">
          <div className="flex flex-col items-center">
            <p className="font-bold text-2xl md:text-3xl mb-4">DOSI:</p>
            <input
              id="porzione"
              className="text-2xl md:text-3xl w-16 focus:outline-none text-center"
              type="number"
              min="1"
              value={porzioni}
              onChange={handlePorzioniChange}
            />
          </div>
          <div className="flex flex-col items-center">
            <p className="font-bold text-2xl md:text-3xl mb-4">INGREDIENTI</p>
            <ul className="w-fit">{writeIngredients()}</ul>
          </div>
        </div>

        <div className="w-full mt-6 md:mt-8">
          <p className="text-xl md:text-2xl font-bold mb-2 md:mb-4">
            PREPARAZIONE:
          </p>
          <textarea
            className="mb-6 md:mb-8 w-full p-2 border rounded"
            value={RecipeDetails.preparazione_ricetta || ""}
            onChange={(e) => handleTextAreaChange(e, "preparazione_ricetta")}
            style={{ overflow: "hidden" }}
          />
        </div>

        <div className="w-full mb-6 md:mb-8">
          <p className="text-xl md:text-2xl font-bold mb-2 md:mb-4">NOTE:</p>
          <textarea
            className="mb-6 md:mb-8 w-full p-2 border rounded"
            value={RecipeDetails.note_ricetta || ""}
            onChange={(e) => handleTextAreaChange(e, "note_ricetta")}
            style={{ overflow: "hidden" }}
          />
        </div>

        <button
          className="btn bg-green-500 hover:bg-green-700 w-full md:w-auto mb-8"
          onClick={saveUpdate}
        >
          Salva modifiche
        </button>

        <button
          className="btn bg-red-500 hover:bg-red-700 w-full md:w-auto mb-8"
          onClick={deleteRecipe}
        >
          Elimina ricetta
        </button>

      </div>
      <Footer />
    </>
  );
}

export default UpdateRecipe;
