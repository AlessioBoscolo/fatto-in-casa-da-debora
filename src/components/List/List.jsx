import React from "react";
import Element from "./Element";
import typeList from "../../dynamic/listValues";

import { useAuth } from "../../context/AuthContext";

function List(props) {
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    if (props.title === "category") {
      fetchCategories();
    }
  }, [props.title]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/home/getCategory",
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
  console.log(categories);

  function writeList() {
    if (props.title === "category") {
      return Object.entries(categories).map(([key, field]) => (
        <Element
          key={key}
          value={field.nome_categoria}
          path={"/" + field.nome_categoria.replace(/\s+/g, '')}
          className=""
        />
      ));
    } else {
      return Object.entries(listChoosen).map(([key, field]) => (
        <Element
          key={key}
          value={field.name}
          path={field.path}
          click={field.click}
          className="text-red-500 hover:text-red-700"
        />
      ));
    }
  }
  const { user } = useAuth();

  return (
    <ul className="menu menu-horizontal px-1">
      <li>
        <details>
          <summary>
            {props.title === "category" ? "Ricette" : user.name}
          </summary>
          <ul className="p-2 z-50">{writeList()}</ul>
        </details>
      </li>
    </ul>
  );
}

export default List;
