import React from "react";
import Element from "./Element";
import typeList from "../../dynamic/listValues";

import { useAuth } from "../../context/AuthContext";

function List(props) {
  const listChoosen = typeList[props.title];
  const { user } = useAuth();


  return (
    <ul className="menu menu-horizontal px-1">
      <li>
        <details>
          <summary>
            {props.title === "category" ? "Ricette" : user.name}
          </summary>
          <ul className="p-2 z-50">
            {Object.entries(listChoosen).map(([key, field]) => {
              return (
                <Element
                  value={field.name}
                  path={field.path}
                  click={field.click}
                  className="text-red-500 hover:text-red-700"
                />
              );
            })}
          </ul>
        </details>
      </li>
    </ul>
  );
}

export default List;
