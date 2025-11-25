import React, {useState, useRef, useEffect} from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { showToast } from "../../components/Toast/Toast";

import Modal from "../../components/Modal";

import TomSelect from 'tom-select';
import 'tom-select/dist/css/tom-select.css';


const { apiUrl } = require("../../config/apiConfig");

function ModifyMenuDay() {
  const [DaysElement, setDaysElement] = React.useState([]);

  const [infoElement, setInfoElement] = React.useState([]);

  const [People, setPeople] = React.useState([]);
  const [Recipe, setRecipe] = React.useState([]);
  const [Ingredients, setIngredients] = React.useState([]);

  const [addNewIngredients, setAddNewIngredients] = useState([
    { name: "", quantity: "", unit: "" },
  ]);


  const [editingIngredient, setEditingIngredient] = useState(null);
  const [ingredientCount, setIngredientCount] = useState(0);

  const [UoM, setUoM] = React.useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [elementClicked, setElementClicked] = useState([]); 

  const [error, setError] = useState(false);

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

  React.useEffect(() => {

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

    const fetchUoM = async () => {
      try {
        const response = await fetch(`${apiUrl}:3001/api/recipe/getUoM`);
        const data = await response.json();
        setUoM(data);
      } catch (error) {
        console.error("Errore nel caricamento degli ingredienti:", error);
      }
    };

    const fetchIngredients = async () => {
      try {
        // Sostituisci con il tuo endpoint API
        const response = await fetch(
          `${apiUrl}:3001/api/recipe/getIngredients`
        );
        const data = await response.json();
        setIngredients(data);
      } catch (error) {
        console.error("Errore nel caricamento degli ingredienti:", error);
      }
    };

  

    fetchDaysElement();
    fetchPeople();
    fetchAllRecipe();
    fetchUoM();
    fetchIngredients();
  }, []);

  const handleDelete = async (idMenu) => {
    const currentElement = DaysElement.find((elem) => elem.id_menu === idMenu);
    setElementClicked(currentElement);

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
              element: currentElement,
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

  const updateMenuElement = async () => {
    console.log(elementClicked);
    
    console.log("nome", elementClicked.nome_ricetta_personalizzata);
    

    if((elementClicked.nome_ricetta_personalizzata == '' && elementClicked.id_ricetta == '') || elementClicked.id_persona == '' || elementClicked.porzioni == ''){
      setError(true);
      return;
    }else if(elementClicked.nome_ricetta_personalizzata !== ''){
      setElementClicked({
        ...elementClicked,
        id_ricetta: 1,
      });
    }
    
    try {
      const response = await fetch(`${apiUrl}:3001/api/menu/updateMenuElement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          element: elementClicked,
          newIngredients: addNewIngredients,
          info: infoElement,
        }),
      });

      if (response.ok) {
        showToast("success", "Elemento modificato con successo!");
        fetchDaysElement();
        setIsModalOpen(false);
        
      } else {
        showToast("error", "Errore durante la modifica dell'elemento!");
        setIsModalOpen(false);

        console.error("Day elements API error:", response.status);
      }
    } catch (error) {
      showToast("error", "Errore durante la modifica dell'elemento!");
      setIsModalOpen(false);

      console.error("Error fetching day elements:", error);
    }
    

    resetFields();
    setIsModalOpen(false);
    setError(false);
    
    
    
  }

  const resetFields = () => {
    setAddNewIngredients([{ name: "", quantity: "", unit: "" }]);
    setIngredientCount(0);
    setEditingIngredient(null);
  }

  const handleModify = async (idMenu) => {

    const currentElement = DaysElement.find((elem) => elem.id_menu === idMenu);
    setElementClicked(currentElement);
    
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
        setIsModalOpen(true);
      } else {
        console.error("Day elements API error:", response.status);
      }
    } catch (error) {
      console.error("Error fetching day elements:", error);
    }
  };

  const handleIngredientChange = (index, field, value) => {    
    const AddNewIngredientsConst = [...addNewIngredients];
    AddNewIngredientsConst[index] = {
      ...AddNewIngredientsConst[index],
      [field]: value,
    };
    
    setAddNewIngredients(AddNewIngredientsConst);
  };



  function writeIngredients() {
    return Object.entries(infoElement).map(([key, field]) => (
      <li key={key} className="mb-2 flex items-center gap-2 flex-wrap">
        {editingIngredient === key ? (
          <>
            <input
              type="number"
              className="w-16 md:w-20 border rounded px-2"
              value={field.quantita || ""}
              onChange={(e) => {
                const newIngredients = [...infoElement  ];
                newIngredients[key] = {
                  ...field,
                  quantita: parseFloat(e.target.value) || 0,
                };
                setInfoElement(newIngredients);
              }}
            />


            <TomSelectComponent
              options={UoM.map(r => ({ value: r.id_unita_misura, text: r.nome_unita_misura }))}
              value={field.id_unita_misura}
              onChange={(e) => {
                const selectedUoM = UoM.find(
                  (u) => u.id_unita_misura === parseInt(e)
                );

                // Add safety check before accessing properties
                if (selectedUoM) {
                  const newIngredients = [...infoElement];
                  newIngredients[key] = {
                    ...field,
                    id_unita_misura: e,
                    nome_unita_misura: selectedUoM.nome_unita_misura,
                  };
                  setInfoElement(newIngredients);
                }
              }}
              placeholder="Cerca una UoM..."
              maxOptions={null}
            />

            <TomSelectComponent
              options={Ingredients.map(r => ({ value: r.id_ingrediente, text: r.nome_ingrediente }))}
              value={field.id_ingrediente}
              onChange={(e) => {
                const selectedIngredient = Ingredients.find(
                  (i) => i.id_ingrediente === parseInt(e)
                );

                if(selectedIngredient){
                  const newIngredients = [...infoElement];
                  newIngredients[key] = {
                    ...field,
                    id_ingrediente: e,
                    nome_ingrediente: selectedIngredient.nome_ingrediente,
                  };
                  setInfoElement(newIngredients);
                }
              }}
              placeholder="Cerca un ingrediente..."
              maxOptions={null}
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
              field.quantita > 0 &&
              field.quantita}{" "}
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
        title="Modifica menù"
        size="xl"
      >         
        <div className="space-y-4">
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome ricetta personalizzato</label>
            <input 
              type="text" 
              id="nome_personalizzato" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={elementClicked.nome_ricetta_personalizzata || ""}
              onChange={(e) => setElementClicked({
                ...elementClicked,
                nome_ricetta_personalizzata: e.target.value
              })}              
              placeholder="Inserisci un nome personalizzato" 
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">Porzioni</label>
            <input 
              type="number" 
              id="porzioni" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={ elementClicked.porzioni || 0 }
              min="1"
              onChange={(e) => setElementClicked({
                ...elementClicked,
                porzioni: e.target.value
              })}              
              placeholder="Inserisci numero porzioni" 
            />
          </div>

          
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seleziona la ricetta
            </label>
            <div className="relative">
              <TomSelectComponent
                options={Recipe.map(r => ({ value: r.id_ricetta, text: r.nome_ricetta }))}
                value={elementClicked.id_ricetta}
                onChange={(e) => setElementClicked({
                  ...elementClicked,
                  id_ricetta: e,
                })}
                placeholder="Cerca una ricetta..."
                maxOptions={null}
              />   
            </div>
          </div>



          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seleziona la persona
            </label>
            <div className="relative">
              <TomSelectComponent
                options={People.map(r => ({ value: r.id_persona, text: r.nome_persona }))}
                value={elementClicked.id_persona}
                onChange={(e) => setElementClicked({
                  ...elementClicked,
                  id_persona: e,
                })}
                placeholder="Cerca una persona..."
                maxOptions={null}
              />   
            </div>
          </div>

          { writeIngredients() }



          {elementClicked.nome_ricetta_personalizzata !== '' && (
            <>
              <br/><h2 className="text-center text-xl font-bold" >Nuovi ingredienti</h2>
              <div className="mb-3">
                <label className="form-label">Numero di ingredienti</label>
                <input
                  type="number"
                  className="form-control"
                  name="ingredientCount"
                  min="0"
                  defaultValue={ingredientCount}
                  onChange={(e) =>
                    setIngredientCount(parseInt(e.target.value) || 0)
                  }
                />
              </div>

              {[...Array(ingredientCount)].map((_, index) => (
                <div key={index} className="mb-16 row">
                  <div className="col-md-5">
                    <label className="form-label">Ingrediente {index + 1}</label>
                    <TomSelectComponent
                      options={Ingredients.map((item) => ({ value: item.id_ingrediente, text: item.nome_ingrediente }))}
                      value={addNewIngredients[index]?.name || ""}
                      onChange={(e) => handleIngredientChange(index, "name", e)}
                      placeholder="Cerca un ingrediente..."
                      maxOptions={null}
                    />   
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Quantità</label>
                    <input
                      type="number"
                      className="form-control"
                      value={addNewIngredients[index]?.quantity || ""}
                      onChange={(e) =>
                        handleIngredientChange(index, "quantity", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Unità di misura</label>
                    <TomSelectComponent
                      options={UoM.map((item) => ({ value: item.id_unita_misura, text: item.nome_unita_misura }))}
                      value={addNewIngredients[index]?.unit || ""}
                      onChange={(e) => handleIngredientChange(index, "unit", e)}
                      placeholder="Cerca una UoM..."
                      maxOptions={null}
                    />   
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="text-left">
          <div className="relative">
            {error && <span className="text-red-500" >Completa tutti i campi obbligatori</span>}
          </div>
        </div>


        <div className="flex justify-end gap-3 pt-4">

          <button
            onClick={() => {
              updateMenuElement();
            }}
    
  
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Modifica
          </button>
          <button
            onClick={() => {
              setIsModalOpen(false);
              resetFields();
            }}
    
  
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annulla
          </button>
        </div>

      </Modal>

      <Footer />
    </>
  );
}

export default ModifyMenuDay;
