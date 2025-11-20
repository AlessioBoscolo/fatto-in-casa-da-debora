import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { showToast } from "../../components/Toast/Toast";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";


import Modal from "../../components/Modal";

import TomSelect from 'tom-select';
import 'tom-select/dist/css/tom-select.css';

const { apiUrl } = require("../../config/apiConfig");

function Menu() {
  const [weekDay, setWeekDay] = React.useState({});
  const [dayMoment, setDayMoment] = React.useState({});
  const [recipe, setRecipe] = React.useState([]);
  const [people, setPeople] = React.useState([]);
  const [dayConfiguration, setDayConfiguration] = React.useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [dayClicked, setDayClicked] = useState([]);
  const [nomePersonalizzato, setNomePersonalizzato] = useState('');
  const [idRicetta, setIdRicetta] = useState('');
  const [idPersona, setIdPersona] = useState('');
  const [error, setError] = useState(false);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState('md');

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

    const fetchDayConfiguration = async () => {
      try {
        const response = await fetch(
          `${apiUrl}:3001/api/menu/getDayConfiguration`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const retrievedData = await response.json();
          setDayConfiguration(retrievedData);
        } else {
          console.error("Day Configuration API error:", response.status);
        }
      } catch (error) {
        console.error("Error fetching day configuration:", error);
      }
    };

    fetchWeekDay();
    fetchDayMoment();
    fetchAllRecipe();
    fetchPeople();
    fetchMenuItems();
    fetchDayConfiguration();
  }, []);

  const { user } = useAuth();

  const clearMenu = async () => {
    try {
      const response = await fetch(`${apiUrl}:3001/api/menu/clearMenu`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  };

  async function openConfirmDelete() {
    Swal.fire({
      title: "Sei sicuro?",
      text: "Vuoi svuotare il menù?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, svuota!",
      cancelButtonText: "Annulla",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const success = await clearMenu();

        if (success) {
          Swal.fire("Eliminato!", "Il menù è stato svuotato.", "success");
          // Ricarica i menu dopo la pulizia
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
        } else {
          Swal.fire(
            "Errore!",
            "Si è verificato un errore durante lo svuotamento del menù.",
            "error"
          );
        }
      }
    });
  }

  async function insertDayRecipe() {
    if((nomePersonalizzato == '' && idRicetta == '') || idPersona == ''){
      setError(true);
      return;
    }

    setIsModalOpen(false);

    
    try {
      const response = await fetch(`${apiUrl}:3001/api/menu/insertMenu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome_personalizzato: nomePersonalizzato,
          id_ricetta: idRicetta,
          id_persona: idPersona,
          id_giorno: dayClicked[0],
          id_momento: dayClicked[1],
        }),
      });

      if (response.ok) {
        showToast("success", "Ricetta inserita con successo!");
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
        setIdRicetta('');
        setIdPersona('');
        setNomePersonalizzato('');
        setError(false);

}
    } catch (error) {
      console.error("Error:", error);
      showToast("error", "Errore nell'inserimento della ricetta");
      setIdRicetta('');
      setIdPersona('');
      setNomePersonalizzato('');
      setError(false);


    }
  }

  function updateMenu(){
    document.cookie = `recipeSelected=${dayClicked[0]},${dayClicked[1]}`;
    window.location.href = '/menu/modificaMenu';
  }


  function writeHeader() {
    return Object.entries(weekDay).map(([key, field]) => {
      const dayConfig = dayConfiguration.find(
        (config) => config.id_giorno_settimana === parseInt(key)
      );

      return (
        <th
          key={key}
          scope="col"
          className="border-e border-neutral-200 px-6 py-4"
        >
          {field.nome_giorno_settimana}
          {dayConfig && (
            <span className="ml-2">{dayConfig.numero_giorno_settimana}</span>
          )}
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
      5: "bg-pink-100",
    };

    return Object.entries(dayMoment).map(([momentKey, field]) => {
      const cells = Array.from({ length: 7 }, (_, dayIndex) => {
        const cellMenuItems = menuItems.filter((item) => {
          return (
            item.id_giorno_settimana === dayIndex &&
            item.id_momento_giornata === field.id_momento_giornata
          );
        });

        return (
          <td
            key={`giorno${dayIndex}${momentKey}`}
            id={`giorno${dayIndex}${momentKey}`}
            /*onClick={
              user.permesso_utente > 1
                ? () => insertDayRecipe(dayIndex, field.id_momento_giornata)
                : undefined
            }*/

            onClick={user.permesso_utente > 1
              ? () => {
              setModalSize('xl');
              setIsModalOpen(true);
              setDayClicked([dayIndex, field.id_momento_giornata]);
            } : undefined }
            className={`whitespace-nowrap border-e border-neutral-200 px-6 py-4 font-medium ${
              user.permesso_utente > 1 ? "cursor-pointer hover:bg-neutral-50" : "cursor-not-allowed"
            }`}
          >
            {cellMenuItems.length > 0 ? (
              <div className="space-y-2">
                {cellMenuItems.map((menuItem, index) => (
                  <div
                    key={menuItem.id_menu}
                    className={`${
                      personColors[menuItem.id_persona] || "bg-gray-100"
                    } 
                               border-b last:border-b-0 pb-2 last:pb-0 
                               rounded p-2`}
                  >
                    <div>
                      {menuItem.nome_ricetta_personalizzata ||
                        menuItem.nome_ricetta}
                    </div>
                    <div className="text-xs text-gray-500">
                      {menuItem.nome_persona}
                    </div>
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

  const handleConfigurationMenu = () => {
    Swal.fire({
      title: 'Configurazione Menu',
      html: `
        <div class="space-y-4">
          ${Object.entries(weekDay).map(([key, field]) => `
            <div class="text-left">
              <label class="block text-sm font-medium text-gray-700 mb-1">${field.nome_giorno_settimana}</label>
              <input 
                type="number" 
                id="giorno_${key}" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="31"
                value="${dayConfiguration.find(config => config.id_giorno_settimana === parseInt(key))?.numero_giorno_settimana || ''}"
                required>
            </div>
          `).join('')}
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Salva configurazione',
      cancelButtonText: 'Annulla',
      customClass: {
        container: 'swal2-container p-0',
        popup: 'swal2-popup rounded-lg w-[95%] mx-auto max-w-lg',
        header: 'swal2-header p-4',
        title: 'text-lg sm:text-xl font-semibold text-gray-800 mb-4',
        htmlContainer: 'swal2-html-container px-4 pb-4',
        actions: 'swal2-actions gap-2 p-4',
        confirmButton: 'px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
        cancelButton: 'px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
      },
      preConfirm: () => {
        const configuration = Object.keys(weekDay).map(key => ({
          id_giorno_settimana: parseInt(key),
          numero_giorno_settimana: parseInt(document.getElementById(`giorno_${key}`).value)
        }));
        return configuration;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${apiUrl}:3001/api/menu/updateDayConfiguration`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(result.value),
          });

          if (response.ok) {
            // Aggiorna la configurazione dei giorni
            const configResponse = await fetch(`${apiUrl}:3001/api/menu/getDayConfiguration`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (configResponse.ok) {
              const retrievedData = await configResponse.json();
              setDayConfiguration(retrievedData);
            }
            Swal.fire('Salvato!', 'Configurazione salvata con successo.', 'success');
          }
        } catch (error) {
          console.error("Error:", error);
          Swal.fire('Errore!', 'Errore durante il salvataggio della configurazione.', 'error');
        }
      }
    });
  };

  const handleSaveMenu = () => {
    Swal.fire({
      title: 'Salva Menù',
      html: `
        <div class="space-y-4">
          <div class="text-left">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome del menù</label>
            <input 
              type="text" 
              id="nome_menu" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Inserisci il nome del menù"
              required>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Salva',
      cancelButtonText: 'Annulla',
      customClass: {
        container: 'swal2-container p-0',
        popup: 'swal2-popup rounded-lg w-[95%] mx-auto max-w-lg',
        header: 'swal2-header p-4',
        title: 'text-lg sm:text-xl font-semibold text-gray-800 mb-4',
        htmlContainer: 'swal2-html-container px-4 pb-4',
        actions: 'swal2-actions gap-2 p-4',
        confirmButton: 'px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
        cancelButton: 'px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
      },
      preConfirm: () => {
        const nomeMenu = document.getElementById('nome_menu').value;
        if (!nomeMenu) {
          Swal.showValidationMessage('Inserisci un nome per il menù');
          return false;
        }
        return nomeMenu;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${apiUrl}:3001/api/menu/saveMenu`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nome_menu: result.value
            }),
          });

          if (response.ok) {
            showToast("success", "Menù salvato con successo!");
          } else {
            showToast("error", "Errore durante il salvataggio del menù");
          }
        } catch (error) {
          console.error("Error:", error);
          showToast("error", "Errore durante il salvataggio del menù");
        }
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="flex overflow-x-auto mt-11">
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
      {user.permesso_utente > 1 && (
        <div className="grid grid-cols-2 mt-11">
          <div className="text-center">
            <button 
              onClick={handleSaveMenu} 
              className="btn bg-green-400 hover:bg-green-500 mt-4"
            >
              Salva menù
            </button>
            <br />
            <button 
              onClick={handleConfigurationMenu} 
              className="btn bg-blue-400 hover:bg-blue-500 mt-4"
            >
              Configurazione menù
            </button>
          </div>
          <div className="text-center">
            <button
              onClick={() => openConfirmDelete()}
              className="btn bg-red-400 hover:bg-red-500 mt-4"
            >
              Svuota menù
            </button>
            <br />
            <Link to="/menu/archivio">
              <button className="btn bg-yellow-400 hover:bg-yellow-500 mt-4">
                Archivio menù
              </button>
            </Link>
          </div>
        </div>
      )}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Inserisci ricetta"
          size="md"
        >
          <div className="space-y-4">
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome ricetta personalizzato
              </label>
              <input 
                type="text" 
                value={nomePersonalizzato}
                onChange={(e) => {setNomePersonalizzato(e.target.value); console.log(nomePersonalizzato)}
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Inserisci un nome personalizzato"
              />
            </div>
            
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seleziona la ricetta
              </label>
              <div className="relative">
                <TomSelectComponent
                  options={recipe.map(r => ({ value: r.id_ricetta, text: r.nome_ricetta }))}
                  value={idRicetta}
                  onChange={(e) => setIdRicetta(e)}
                  placeholder="Cerca una ricetta..."
                  maxOptions={500}
                />   
              </div>
            </div>
            
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seleziona la persona
              </label>
              <div className="relative">
                <TomSelectComponent
                  options={people.map(r => ({ value: r.id_persona, text: r.nome_persona }))}
                  value={idPersona}
                  onChange={(e) => setIdPersona(e)}
                  placeholder="Cerca una persona  ..."
                  maxOptions={500}
                />              
              </div>
            </div>

            <div className="text-left">
              <div className="relative">
                {error && <span className="text-red-500" >Completa tutti i campi obbligatori</span>}
              </div>
            </div>



            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => {
                  insertDayRecipe();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Inserisci
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIdRicetta('');
                  setIdPersona('');
                  setNomePersonalizzato('');
                  setError(false);
                  updateMenu();
                }}
        
      
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Modifica
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIdRicetta('');
                  setIdPersona('');
                  setNomePersonalizzato('');
                  setError(false);
                }}
        
      
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
            </div>
          </div>
        </Modal>  
      <Footer />
    </>
  );
}

export default Menu;
