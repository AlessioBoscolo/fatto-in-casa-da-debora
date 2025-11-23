import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { showToast } from "../../components/Toast/Toast";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import Modal from "../../components/Modal";

const { apiUrl } = require("../../config/apiConfig");

function Archivio() {
  const [menuArchiviati, setMenuArchiviati] = useState([]);
  const [elementClicked, setElementClicked] = useState([]);

  const [NewNomeArchivio, setNewNomeArchivio] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMenuArchiviati = async () => {
    try {
      const response = await fetch(
        `${apiUrl}:3001/api/menu/getMenuArchiviati`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const retrievedData = await response.json();
        setMenuArchiviati(retrievedData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    // Funzione per recuperare i menu dal database
    fetchMenuArchiviati();
  }, []);


  async function updateMenu(idMenuArchiviato){
    const currentElement = menuArchiviati.find((elem) => elem.id_archivio_nome === idMenuArchiviato);
    
    setElementClicked(currentElement);
    setNewNomeArchivio(currentElement.nome_archivio_nome);
    setIsModalOpen(true);
  }

  async function setNewName(){
    try {
      const response = await fetch(
        `${apiUrl}:3001/api/menu/updateMenuArchiviatoNome`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idNomeMenu: elementClicked.id_archivio_nome,
            nomeArchivioNome: NewNomeArchivio,
          }),
  
        }
      );

      if (response.ok) {
        // Toast
        showToast("success", "Archivio rinominato con successo!");
        fetchMenuArchiviati();

      }
    } catch (error) {
      showToast("error", "Errore durante la rinomina dell'archivio!");
      console.error("Error:", error);
    }
  }
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-10">Menu Archiviati</h1>

        {menuArchiviati.length === 0 ? (
          <p>Nessun menu archiviato trovato.</p>
        ) : (
          <ul className="space-y-4">
            {menuArchiviati.map((menu) => (
              <li
                key={menu.id_archivio_nome}
                className="border p-4 rounded-lg shadow"
              >
                <Link
                  to={`/menu/archivio/${menu.id_archivio_nome}`}
                  className="text-xl font-semibold text-blue-600 hover:text-blue-800"
                >
                  {menu.nome_archivio_nome}
                </Link>
                <button
                  onClick={() => {
                    updateMenu(menu.id_archivio_nome);
                  }}
        
      
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors item-justify-right float-right"
                >
                  Rinomina
                </button>

              </li>
            ))}
          </ul>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Inserisci ricetta"
        size="xl"
      >
        <div className="space-y-4">
          <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome menu archiviato
              </label>
              <input 
                type="text" 
                value={NewNomeArchivio}
                onChange={(e) => {setNewNomeArchivio(e.target.value)}}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Inserisci il nuovo nome archivio"
              />
          </div>
          <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => {
                  setNewName();
                  setIsModalOpen(false);
                }}
        
      
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Modifica
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
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

export default Archivio;
