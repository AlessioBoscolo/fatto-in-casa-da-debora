import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";

const { apiUrl } = require("../../config/apiConfig");

function Archivio_Menu() {
  const { id_archivio } = useParams();
  const navigate = useNavigate();
  const [weekDay, setWeekDay] = useState({});
  const [dayMoment, setDayMoment] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [menuName, setMenuName] = useState({});

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

    const fetchArchivedMenu = async () => {
      try {
        const response = await fetch(
          `${apiUrl}:3001/api/menu/getArchiviedElement`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id_archivied: id_archivio,
            }),
          }
        );

        if (response.ok) {
          const retrievedData = await response.json();
          setMenuItems(retrievedData);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchMenuArchivedName = async () => {
      try {
        const response = await fetch(`${apiUrl}:3001/api/menu/getMenuName`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_archivied: id_archivio,
          }),
        });

        if (response.ok) {
          const retrievedData = await response.json();
          setMenuName(retrievedData);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchWeekDay();
    fetchDayMoment();
    fetchArchivedMenu();
    fetchMenuArchivedName();
  }, []);

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

  const clearArchivedMenu = async () => {
    try {
      const response = await fetch(
        `${apiUrl}:3001/api/menu/clearMenuArchivied`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_archivied: id_archivio,
          }),
        }
      );

      if (response.ok) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  };

  const uploadMenu = async () => {
    try {
      const response = await fetch(
        `${apiUrl}:3001/api/menu/uploadMenuArchivied`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_archivied: id_archivio,
          }),
        }
      );

      if (response.ok) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  };

  async function openConfirmUpload() {
    Swal.fire({
      title: "Sei sicuro?",
      text: "Vuoi caricare il menù? Così facendo andrai ad eliminare il menù attuale",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, carica!",
      cancelButtonText: "Annulla",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const success = await clearMenu();

        if (success) {
          const success2 = await uploadMenu();
          if (success2) {
            Swal.fire(
              "Caricato!",
              "Il menù è stato caricato con successo.",
              "success"
            );
            navigate("/menu");
          } else {
            Swal.fire(
              "Errore!",
              "Si è verificato un errore durante il caricamento del menù.",
              "error"
            );
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

  async function openConfirmDelete() {
    Swal.fire({
      title: "Sei sicuro?",
      text: "Vuoi eliminare il menù?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, elimina!",
      cancelButtonText: "Annulla",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const success = await clearArchivedMenu();

        if (success) {
          Swal.fire("Eliminato!", "Il menù è stato eliminato.", "success");
          navigate("/menu/archivio");
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
            className="whitespace-nowrap border-e border-neutral-200 px-6 py-4 font-medium"
          >
            {cellMenuItems.length > 0 ? (
              <div className="space-y-2">
                {cellMenuItems.map((menuItem) => (
                  <div
                    key={menuItem.id_archivio_menu}
                    className={`${
                      personColors[menuItem.id_persona] || "bg-gray-100"
                    } 
                    border-b last:border-b-0 pb-2 last:pb-0 
                    rounded p-2`}
                  >
                    <div>
                      {menuItem.ricetta_personalizzata_archivio_menu ||
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
        <tr key={`momento${momentKey}`} className="border-b border-neutral-200">
          <td className="whitespace-nowrap border-e border-neutral-200 px-6 py-4 font-medium">
            {field.nome_momento_giornata}
          </td>
          {cells}
        </tr>
      );
    });
  }

  return (
    <>
      <Navbar />
      <h1 className="mt-4 font-semibold text-center text-3xl text-red-500">
        {menuName?.[0]?.nome_archivio_nome}
      </h1>

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

      <div className="grid grid-cols-2 mt-11">
        <div className="text-center">
          <button
            onClick={() => openConfirmUpload()}
            className="btn bg-green-400 hover:bg-green-500 mt-4"
          >
            Carica menù
          </button>
        </div>
        <div className="text-center">
          <button
            onClick={() => openConfirmDelete()}
            className="btn bg-red-400 hover:bg-red-500 mt-4"
          >
            Elimina menù archiviato
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Archivio_Menu;
