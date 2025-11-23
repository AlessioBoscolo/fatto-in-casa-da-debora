import React, {useState, useRef, useEffect} from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";

import Modal from "../../components/Modal";

import TomSelect from 'tom-select';
import 'tom-select/dist/css/tom-select.css';


const { apiUrl } = require("../../config/apiConfig");

function ModifyMenuDay() {
  const [DaysElement, setDaysElement] = React.useState([]);

  const [infoElement, setInfoElement] = React.useState([]);

  const [People, setPeople] = React.useState([]);
  const [Recipe, setRecipe] = React.useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [elementClicked, setElementClicked] = useState([]); 

  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("recipeSelected="))
    ?.split("=")[1];

  const cookieData = decodeURIComponent(cookieValue).split(",");
  const giorno = cookieData[0];
  const momento_giornata = cookieData[1];


  const TomSelectComponent = ({ 
    options = [], 
    value, 
    onChange, 
    placeholder = 'Seleziona...',
    maxItems = 1,
    create = false,
    valueField = 'value',
    labelField = 'text',
    searchField = ['text'],
    maxOptions = null,
  }) => {
    const selectRef = useRef(null);
    const tomSelectRef = useRef(null);
  
    useEffect(() => {
      if (selectRef.current && !tomSelectRef.current) {
        // Inizializza Tom Select
        tomSelectRef.current = new TomSelect(selectRef.current, {
          options: options,
          valueField: valueField,
          labelField: labelField,
          searchField: searchField,
          maxItems: maxItems,
          maxOptions: maxOptions,
          create: create,
          placeholder: placeholder,
          plugins: [
            'remove_button',       // X su ogni item (multi-select)
          ],
          onChange: (value) => {
            if (onChange) {
              onChange(value);
            }
          }
        });
  
        // Imposta il valore iniziale
        if (value) {
          tomSelectRef.current.setValue(value, true);
        }
      }
  
      // Cleanup
      return () => {
        if (tomSelectRef.current) {
          tomSelectRef.current.destroy();
          tomSelectRef.current = null;
        }
      };
    }, []);
  
    // Aggiorna le opzioni quando cambiano
    useEffect(() => {
      if (tomSelectRef.current) {
        tomSelectRef.current.clearOptions();
        tomSelectRef.current.addOptions(options);
      }
    }, [options]);
  
    // Aggiorna il valore quando cambia
    useEffect(() => {
      if (tomSelectRef.current && value !== tomSelectRef.current.getValue()) {
        tomSelectRef.current.setValue(value, true);
      }
    }, [value]);
  
    return (
      <select ref={selectRef} />
    );
  };




  React.useEffect(() => {
    const fetchDaysElement = async () => {
      try {
        const response = await fetch(`${apiUrl}:3001/api/menu/getDaysElement`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_giorno: giorno,
            id_momento: momento_giornata,
          }),
        });

        if (response.ok) {
          const retrievedData = await response.json();
          setDaysElement(retrievedData);
        } else {
          console.error("Day elements API error:", response.status);
        }
      } catch (error) {
        console.error("Error fetching day elements:", error);
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

    fetchDaysElement();
    fetchPeople();
    fetchAllRecipe();
  }, []);

  const handleDelete = async (idMenu) => {
    const result = await Swal.fire({
      title: "Sei sicuro?",
      text: "Vuoi eliminare questa ricetta dal menu?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sì, elimina!",
      cancelButtonText: "Annulla",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${apiUrl}:3001/api/menu/deleteMenuElement`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id_menu: idMenu,
            }),
          }
        );

        if (response.ok) {
          setDaysElement(DaysElement.filter((elem) => elem.id_menu !== idMenu));
          Swal.fire(
            "Eliminato!",
            "La ricetta è stata eliminata con successo.",
            "success"
          );
        } else {
          Swal.fire(
            "Errore",
            "Errore durante l'eliminazione della ricetta",
            "error"
          );
        }
      } catch (error) {
        console.error("Errore durante l'eliminazione:", error);
        Swal.fire(
          "Errore",
          "Errore durante l'eliminazione della ricetta",
          "error"
        );
      }
    }
  };

  const handleModify = async (idMenu) => {

    const currentElement = DaysElement.find((elem) => elem.id_menu === idMenu);

    console.log(currentElement);
    
    try {
      const response = await fetch(`${apiUrl}:3001/api/menu/getElementsOfRecipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idMenu: currentElement.id_menu,
        }),
      });

      if (response.ok) {
        const retrievedData = await response.json();
        setInfoElement(retrievedData);
      } else {
        console.error("Day elements API error:", response.status);
      }
    } catch (error) {
      console.error("Error fetching day elements:", error);
    }



    /*
    Swal.fire({
      title: "Modifica Ricetta",
      html: `
        <div class="space-y-4">
          <div class="text-left">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome ricetta personalizzato</label>
            <input 
              type="text" 
              id="nome_personalizzato" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value="${currentElement.nome_ricetta_personalizzata || ""}"
              placeholder="Inserisci un nome personalizzato">
          </div>
          
          <div class="text-left">
            <label class="block text-sm font-medium text-gray-700 mb-1">Seleziona la ricetta</label>
            <div class="relative">
              <select 
                id="id_ricetta" 
                class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm mobile-select"
                required>
                ${Recipe.map(
                  (recipeItem) =>
                    `<option value="${recipeItem.id_ricetta}" 
                    ${
                      recipeItem.nome_ricetta === currentElement.nome_ricetta
                        ? "selected"
                        : ""
                    }>
                    ${recipeItem.nome_ricetta}
                  </option>`
                ).join("")}
              </select>
            </div>
          </div>
          
          <div class="text-left">
            <label class="block text-sm font-medium text-gray-700 mb-1">Seleziona la persona</label>
            <div class="relative">
              <select 
                id="id_persona" 
                class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm mobile-select"
                required>
                ${People.map(
                  (peopleItem) =>
                    `<option value="${peopleItem.id_persona}"
                    ${
                      peopleItem.nome_persona === currentElement.nome_persona
                        ? "selected"
                        : ""
                    }>
                    ${peopleItem.nome_persona}
                  </option>`
                ).join("")}
              </select>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Salva modifiche",
      cancelButtonText: "Annulla",
      customClass: {
        container: "swal2-container p-0",
        popup: "swal2-popup rounded-lg w-[95%] mx-auto max-w-lg",
        header: "swal2-header p-4",
        title: "text-lg sm:text-xl font-semibold text-gray-800 mb-4",
        htmlContainer: "swal2-html-container px-4 pb-4",
        actions: "swal2-actions gap-2 p-4",
        confirmButton:
          "px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
        cancelButton:
          "px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
      },
      didOpen: () => {
        const mobileSelects = document.querySelectorAll(".mobile-select");
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
          mobileSelects.forEach((select) => {
            select.addEventListener("touchstart", (e) => {
              e.stopPropagation();
            });
            select.addEventListener("click", (e) => {
              e.stopPropagation();
            });
          });
        }
      },
      width: "auto",
      padding: 0,
      position: "center",
      allowOutsideClick: true,
      showClass: {
        popup: "animate__animated animate__fadeInDown animate__faster",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp animate__faster",
      },
      preConfirm: () => {
        return {
          nome_personalizzato: document.getElementById("nome_personalizzato")
            .value,
          id_ricetta: document.getElementById("id_ricetta").value,
          id_persona: document.getElementById("id_persona").value,
        };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `${apiUrl}:3001/api/menu/updateMenuElement`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id_menu: idMenu,
                ...result.value,
              }),
            }
          );

          if (response.ok) {
            // Aggiorna la lista dei DaysElement con i nuovi dati
            const updatedDaysElement = await fetch(
              `${apiUrl}:3001/api/menu/getDaysElement`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id_giorno: giorno,
                  id_momento: momento_giornata,
                }),
              }
            );

            if (updatedDaysElement.ok) {
              const retrievedData = await updatedDaysElement.json();
              setDaysElement(retrievedData);
            }

            Swal.fire({
              title: "Modificato!",
              text: "La ricetta è stata modificata con successo.",
              icon: "success",
              customClass: {
                popup: "swal2-popup rounded-lg",
              },
            });
          } else {
            Swal.fire({
              title: "Errore",
              text: "Errore durante la modifica della ricetta",
              icon: "error",
              customClass: {
                popup: "swal2-popup rounded-lg",
              },
            });
          }
        } catch (error) {
          console.error("Errore durante la modifica:", error);
          Swal.fire({
            title: "Errore",
            text: "Errore durante la modifica della ricetta",
            icon: "error",
            customClass: {
              popup: "swal2-popup rounded-lg",
            },
          });
        }
      }
    });
    */
  };

  return (
    <>
      <Navbar />
      <p className="mt-4 text-3xl text-red-500 text-center">Modifica giorno</p>
      <div className="container mt-10 overflow-x-auto">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID Menu</th>
              <th>Nome Ricetta</th>
              <th>Nome Personalizzato</th>
              <th>Nome Persona</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {DaysElement.map((elemento) => (
              <tr key={elemento.id_menu}>
                <td>{elemento.id_menu}</td>
                <td>{elemento.nome_ricetta}</td>
                <td>{elemento.nome_ricetta_personalizzata}</td>
                <td>{elemento.nome_persona}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => handleDelete(elemento.id_menu)}
                  >
                    Elimina
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleModify(elemento.id_menu)}
                  >
                    Modifica
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="container">
        <Link to="/menu">
          <button className="btn">Torna al menu</button>
        </Link>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Inserisci ricetta"
        size="xl"
      >
        {  console.log("element",infoElement) }
        {
         /*
        <div className="space-y-4">
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome ricetta personalizzato</label>
            <input 
              type="text" 
              id="nome_personalizzato" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={currentElement.nome_ricetta_personalizzata || ""}
              placeholder="Inserisci un nome personalizzato" 
            />
          </div>
          
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">Seleziona la ricetta</label>
            <div className="relative">
              <TomSelectComponent
                options={Recipe.map((recipeItem) => ({ value: item.id_ricetta, text: item.nome_ingrediente, selected: recipeItem.nome_ricetta === currentElement.nome_ricetta }))}
                value={ingredients[index]?.name || ""}
                onChange={(e) => handleIngredientChange(index, "name", e)}
                placeholder="Cerca un una ricetta..."
                maxOptions={null}
              />   



              <select 
                id="id_ricetta" 
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm mobile-select"
                required>
                ${Recipe.map(
                  (recipeItem) =>
                    `<option value="${recipeItem.id_ricetta}" 
                    ${
                      recipeItem.nome_ricetta === currentElement.nome_ricetta
                        ? "selected"
                        : ""
                    }>
                    ${recipeItem.nome_ricetta}
                  </option>`
                ).join("")}
              </select>
            </div>
          </div>
          
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">Seleziona la persona</label>
            <div className="relative">
              <select 
                id="id_persona" 
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm mobile-select"
                required>
                ${People.map(
                  (peopleItem) =>
                    `<option value="${peopleItem.id_persona}"
                    ${
                      peopleItem.nome_persona === currentElement.nome_persona
                        ? "selected"
                        : ""
                    }>
                    ${peopleItem.nome_persona}
                  </option>`
                ).join("")}
              </select>
            </div>
          </div>
        </div>
      */ }
      </Modal>

      <Footer />
    </>
  );
}

export default ModifyMenuDay;
