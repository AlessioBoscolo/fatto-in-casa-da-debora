import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";

const { apiUrl } = require("../../config/apiConfig");

function Archivio() {
  const [menuArchiviati, setMenuArchiviati] = useState([]);

  useEffect(() => {
    // Funzione per recuperare i menu dal database
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

    fetchMenuArchiviati();
  }, []);

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
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Archivio;
