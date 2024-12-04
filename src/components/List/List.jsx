import React from "react";
import Element from "./Element";
import typeList from "../../dynamic/listValues";

import { useAuth } from "../../context/AuthContext";

const { apiUrl } = require('../../config/apiConfig');


function List(props) {
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    if (props.title === "category") {
      fetchCategories();
    }
  },1);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${apiUrl}:3001/api/home/getCategory`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const retrievedData = await response.json();
        setCategories(retrievedData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const listChoosen =
    props.title === "category" ? categories : typeList[props.title];

  function writeList() {
    if (props.title === "category") {
      return Object.entries(categories).map(([key, field]) => (
        <Element
          key={key}
          value={field.nome_categoria}
          path={"/categoria/" + field.id_categoria}
          className="whitespace-nowrap"
        />
      ));
    } else {
      return Object.entries(listChoosen).map(([key, field]) => {
        if (user.permesso_utente >= field.permission) {
          return (
            <Element
              key={key}
              value={field.name}
              path={field.path}
              click={field.click}
              className="text-red-500 hover:text-red-700 whitespace-nowrap"
            />
          );
        }
        return null;
      });
    }
  }
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <>
      <a
        href="#"
        className="hover:text-red-700 text-red-500 font-bold text-[15px] lg:hover:fill-[#007bff] flex items-center gap-1"
        onClick={(e) => {
          e.preventDefault();
          setIsMenuOpen(!isMenuOpen);
        }}
      >
        {props.title === "category"
          ? "Ricette"
          : `Benvenuto ${user.nome_utente}!`}
        <svg
          className={`w-4 h-4 transition-transform ${
            isMenuOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </a>

      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } lg:group-hover:block lg:absolute lg:top-full lg:left-0 lg:w-48 bg-white shadow-lg rounded-lg py-2   z-50 whitespace-nowrap min-w-max border`}
      >
        {writeList()}
      </div>
    </>
  );
}

export default List;
