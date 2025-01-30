import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";
import { showToast } from "../components/Toast/Toast";

const { apiUrl } = require("../config/apiConfig");

function Menu() {
  const [weekDay, setWeekDay] = React.useState({});
  const [dayMoment, setDayMoment] = React.useState({});
  const [recipe, setRecipe] = React.useState([]);
  const [people, setPeople] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState({ day: null, moment: null });
  const [selectedRecipe, setSelectedRecipe] = useState("");
  const [selectedPeople, setSelectedPeople] = useState("");
  const [menuItems, setMenuItems] = useState([]);

  React.useEffect(() => {
    const fetchWeekDay = async () => {
      try {
        const response = await fetch(`${apiUrl}:3001/api/menu/getWeekDay`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const retrievedData = await response.json();
          setWeekDay(retrievedData);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchDayMoment = async () => {
      try {
        const response = await fetch(`${apiUrl}:3001/api/menu/getDayMoment`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const retrievedData = await response.json();
          setDayMoment(retrievedData);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchAllRecipe = async () => {
      try {
        const response = await fetch(`${apiUrl}:3001/api/menu/getAllRecipe`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const retrievedData = await response.json();
          setRecipe(retrievedData);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchPeople = async () => {
      try {
        const response = await fetch(`${apiUrl}:3001/api/menu/getPeople`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const retrievedData = await response.json();
          setPeople(retrievedData);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`${apiUrl}:3001/api/menu/getMenu`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const retrievedData = await response.json();
          setMenuItems(retrievedData);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchWeekDay();
    fetchDayMoment();
    fetchAllRecipe();
    fetchPeople();
    fetchMenuItems();
  }, []);

  function insertDayRecipe(id_giorno, id_momento) {
    setSelectedCell({ day: id_giorno, moment: id_momento });
    setIsModalOpen(true);
    document.cookie =
      encodeURIComponent("recipeSelected") +
      "=" +
      encodeURIComponent(id_giorno.toString() + "," + id_momento.toString()) +
      "; path=/";
  }

  function writeHeader() {
    return Object.entries(weekDay).map(([key, field]) => {
      return (
        <th
          key={key}
          scope="col"
          className="border-e border-neutral-200 px-6 py-4"
        >
          {field.nome_giorno_settimana}
        </th>
      );
    });
  }

  function writeContent() {
    // Mappa degli id_persona ai colori
    const personColors = {
      1: "bg-blue-100",
      2: "bg-green-100",
      3: "bg-yellow-100",
      4: "bg-purple-100",
      5: "bg-pink-100"
    };

    return Object.entries(dayMoment).map(([momentKey, field]) => {
      const cells = Array.from({ length: 7 }, (_, dayIndex) => {
        const cellMenuItems = menuItems.filter(item => {
          return item.id_giorno_settimana === dayIndex && 
                 item.id_momento_giornata === field.id_momento_giornata;
        });

        return (
          <td
            key={`giorno${dayIndex}${momentKey}`}
            id={`giorno${dayIndex}${momentKey}`}
            onClick={() => insertDayRecipe(dayIndex, field.id_momento_giornata)}
            className="whitespace-nowrap border-e border-neutral-200 px-6 py-4 font-medium"
          >
            {cellMenuItems.length > 0 ? (
              <div className="space-y-2">
                {cellMenuItems.map((menuItem, index) => (
                  <div 
                    key={menuItem.id_menu} 
                    className={`${personColors[menuItem.id_persona] || 'bg-gray-100'} 
                               border-b last:border-b-0 pb-2 last:pb-0 
                               rounded p-2`}
                  >
                    <div>{menuItem.nome_ricetta_personalizzata || menuItem.nome_ricetta}</div>
                    <div className="text-xs text-gray-500">{menuItem.nome_persona}</div>
                  </div>
                ))}
              </div>
            ) : (
              "\u00A0"
            )}
          </td>
        );
      });

      return (
        <tr
          key={`momento${momentKey}`}
          id={`momento${momentKey}`}
          className="border-b border-neutral-200"
        >
          <td className="whitespace-nowrap border-e border-neutral-200 px-6 py-4 font-medium">
            {field.nome_momento_giornata}
          </td>
          {cells}
        </tr>
      );
    });
  }

  const handleChangeRecipe = (e) => {
    const { name, value } = e.target;
    setSelectedRecipe(value);
  };

  const handleChangePeople = (e) => {
    const { name, value } = e.target;
    setSelectedPeople(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}:3001/api/menu/insertMenu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome_personalizzato: e.target.nome_personalizzato.value,
          id_ricetta: e.target.id_ricetta.value,
          id_persona: e.target.id_persona.value,
          id_giorno: selectedCell.day,
          id_momento: selectedCell.moment
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        showToast("success", "Ricetta inserita con successo!");
        e.target.nome_personalizzato.value = "";
        
        // Ricarica i menu dopo l'inserimento
        const menuResponse = await fetch(`${apiUrl}:3001/api/menu/getMenu`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (menuResponse.ok) {
          const retrievedData = await menuResponse.json();
          setMenuItems(retrievedData);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("error", "Errore nell'inserimento della ricetta");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex overflow-x-auto">
        <table className="min-w-full border border-neutral-200 text-center text-sm font-light text-surface">
          <thead className="border-b border-neutral-200 font-medium">
            <tr>
              <th scope="col" className="border-e border-neutral-200 px-6 py-4">
                \
              </th>
              {writeHeader()}
            </tr>
          </thead>
          <tbody>{writeContent()}</tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl">Inserisci Ricetta</h2>
            <hr className="mb-3"></hr>
            <p>
              Giorno: {selectedCell.day}, Momento: {selectedCell.moment}
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">
                  Nome della ricetta personalizzato
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="nome_personalizzato"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Seleziona la ricetta</label>
                <select
                  className="form-control"
                  name="id_ricetta"
                  value={selectedRecipe}
                  onChange={handleChangeRecipe}
                  required
                >
                  {Array.isArray(recipe) &&
                    recipe.map((recipeItem, index) => (
                      <option key={index} value={recipeItem.id_ricetta}>
                        {recipeItem.nome_ricetta}
                      </option>
                    ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Seleziona la persona</label>
                <select
                  className="form-control"
                  name="id_persona"
                  value={selectedPeople}
                  onChange={handleChangePeople}
                  required
                >
                  {Array.isArray(people) &&
                    people.map((peopleItem, index) => (
                      <option key={index} value={peopleItem.id_persona}>
                        {peopleItem.nome_persona}
                      </option>
                    ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn bg-green-500 hover:bg-green-700"
              >
                Aggiungi ricetta
              </button>
            </form>

            {/* Aggiungi qui il contenuto del tuo modal */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Menu;
