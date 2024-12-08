import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";
import { showToast } from "../components/Toast/Toast";

const { apiUrl } = require("../config/apiConfig");

function InsertRecipe() {
  const [recipe, setRecipe] = useState({
    name: "",
    image: "",
    category: "",
    servings: "",
    instructions: "",
    notes: "",
  });

  const [ingredientCount, setIngredientCount] = useState(1);
  const [category, setCategory] = useState([]);
  const [UoM, setUoM] = useState([]);
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "" },
  ]);

  const [ingredientsList, setIngredientsList] = useState([]);

  // New ingredients
  const [newIngredientCount, setNewIngredientCount] = useState(1);
  const [newIngredients, setNewIngredients] = useState([{ name: "" }]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        // Sostituisci con il tuo endpoint API
        const response = await fetch(
          `${apiUrl}:3001/api/recipe/getIngredients`
        );
        const data = await response.json();
        setIngredientsList(data);
      } catch (error) {
        console.error("Errore nel caricamento degli ingredienti:", error);
      }
    };
    fetchIngredients();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`${apiUrl}:3001/api/home/getCategory`);
        const data = await response.json();
        setCategory(data);
      } catch (error) {
        console.error("Errore nel caricamento degli ingredienti:", error);
      }
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
    fetchCategory();
    fetchUoM();
  }, []);

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: value,
    };
    setIngredients(newIngredients);
  };

  const handleNewIngredientChange = (index, field, value) => {
    const updatedIngredients = [...newIngredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    };
    setNewIngredients(updatedIngredients);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}:3001/api/recipe/insertRecipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeDetails: recipe,
          ingredientDetails: ingredients,
        }),
      });

      if (response.ok) {
        showToast("success", "Ricetta inserita con successo!");
      }
    } catch (error) {
      showToast("error", "Errore nell'inserimento della ricetta");
    }
  };

  const handleIngredientSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${apiUrl}:3001/api/recipe/insertIngredient`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newIngredient: newIngredients,
          }),
        }
      );

      if (response.ok) {
        showToast("success", "Nuovi ingredienti inseriti con successo!");
        // Aggiorna la lista degli ingredienti
        const updatedIngredientsResponse = await fetch(
          `${apiUrl}:3001/api/recipe/getIngredients`
        );
        const updatedData = await updatedIngredientsResponse.json();
        setIngredientsList(updatedData);
      }
    } catch (error) {
      showToast("error", "Errore nell'inserimento degli ingredienti");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <p className="text-5xl mb-16 text-red-500">
          Inserisci una nuova ricetta
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nome della ricetta</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={recipe.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Immagine (URL)</label>
            <input
              type="text"
              className="form-control"
              name="image"
              value={recipe.image}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Categoria</label>
            <select
              className="form-control"
              name="category"
              value={recipe.category}
              onChange={handleChange}
              required
            >
              <option value="">Seleziona una categoria</option>
              {category.map(
                (category, index) =>
                  category.link_categoria && (
                    <option key={index} value={category.id_categoria}>
                      {category.nome_categoria}
                    </option>
                  )
              )}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Numero di porzioni</label>
            <input
              type="number"
              className="form-control"
              name="servings"
              value={recipe.servings}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Numero di ingredienti</label>
            <input
              type="number"
              className="form-control"
              name="ingredientCount"
              min="1"
              defaultValue="1"
              onChange={(e) =>
                setIngredientCount(parseInt(e.target.value) || 1)
              }
            />
          </div>

          {[...Array(ingredientCount)].map((_, index) => (
            <div key={index} className="mb-16 row">
              <div className="col-md-5">
                <label className="form-label">Ingrediente {index + 1}</label>
                <select
                  className="form-control"
                  value={ingredients[index]?.name || ""}
                  onChange={(e) =>
                    handleIngredientChange(index, "name", e.target.value)
                  }
                  required
                >
                  <option value="">Seleziona un ingrediente</option>
                  {ingredientsList.map((item, i) => (
                    <option key={i} value={item.id_ingrediente}>
                      {item.nome_ingrediente}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Quantità</label>
                <input
                  type="number"
                  className="form-control"
                  value={ingredients[index]?.quantity || ""}
                  onChange={(e) =>
                    handleIngredientChange(index, "quantity", e.target.value)
                  }
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Unità di misura</label>
                <select
                  className="form-control"
                  value={ingredients[index]?.unit || ""}
                  onChange={(e) =>
                    handleIngredientChange(index, "unit", e.target.value)
                  }
                  required
                >
                  <option value="">Seleziona unità</option>
                  {UoM.map((item, i) => (
                    <option key={i} value={item.id_unita_misura}>
                      {item.nome_unita_misura}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          <div className="mb-3">
            <label className="form-label">Procedimento</label>
            <textarea
              className="form-control"
              name="instructions"
              value={recipe.instructions}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Note aggiuntive</label>
            <textarea
              className="form-control"
              name="notes"
              value={recipe.notes}
              onChange={handleChange}
              rows="2"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Salva Ricetta
          </button>
        </form>
      </div>

      <div className="container mt-16">
        <p className="text-5xl mb-16 text-red-500">
          Inserisci ingredienti mancanti
        </p>
        <form>
          <div className="mb-3">
            <label className="form-label">
              Numero di ingredienti da inserire
            </label>
            <input
              type="number"
              className="form-control"
              name="newIngredientCount"
              min="1"
              defaultValue="1"
              onChange={(e) =>
                setNewIngredientCount(parseInt(e.target.value) || 1)
              }
            />
          </div>

          {[...Array(newIngredientCount)].map((_, index) => (
            <div key={index} className="mb-3">
              <label className="form-label">Nome ingrediente {index + 1}</label>
              <input
                type="text"
                className="form-control"
                name={`newIngredient${index}`}
                placeholder={`Inserisci il nome del nuovo ingrediente ${
                  index + 1
                }`}
                onChange={(e) =>
                  handleNewIngredientChange(index, "name", e.target.value)
                }
              />
            </div>
          ))}

          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleIngredientSubmit}
          >
            Aggiungi Ingredienti
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default InsertRecipe;
