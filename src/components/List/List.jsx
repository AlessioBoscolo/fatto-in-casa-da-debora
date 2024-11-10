import React from "react";
import Element from "./Element";

function List() {
  return (
    <ul className="menu menu-horizontal px-1">
      <li>
        <details>
          <summary>Ricette</summary>
          <ul className="p-2 z-50">
            <Element value="Inserisci" className="text-red-500 hover:text-red-700" />
          </ul>
        </details>
      </li>
    </ul>
  );
}

export default List;
