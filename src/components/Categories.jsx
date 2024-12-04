import React from "react";
import { Link } from "react-router-dom";

import Image from "./Image";

const { apiUrl } = require('../config/apiConfig');

function Categories() {
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    fetchCategories();
  },[1]);

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

  function writeIcon() {
    return Object.entries(categories).map(([key, field]) => 
      field.link_categoria && (
        <div key={key} className="flex items-center justify-center">
          <div className="grid grid-cols-1">
            <Link className="" to={"/categoria/" + field.id_categoria}>
              <div className="flex items-center justify-center">
                <Image
                  width="70"
                  height="70"
                  src={field.link_categoria}
                  alt={"img-" + field.nome_categoria.replace(/\s+/g, "")}
                />
              </div>
              <div className="mt-2 text-white">{field.nome_categoria}</div>
            </Link>
          </div>
        </div>
      )
    );
  }

  return (
    <div className="mt-48 bg-red-500 flex flex-row justify-center items-center">
      <div className="w-9/12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        {writeIcon()}
      </div>
    </div>
  );
}

export default Categories;
