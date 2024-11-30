import React from "react";

import Card from "./Card";

function Cards() {
  return (
    <div className="mt-24 flex flex-row justify-center items-center">
      <div className="w-9/12 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 p-4">
        <Card title="Titolo 1" src="https://i.postimg.cc/N0VQ9jC0/Ciambellone-soffice.jpg" desc="Descrizione 1"/>
        <Card title="Titolo 2" src="https://i.postimg.cc/cCQ7tVT7/Pasta-al-forno-con-mozzarella.jpg" desc="Descrizione 2" />
        <Card title="Titolo 3" src="https://i.postimg.cc/7P0yqm6D/Zucchine-ripiene-di-tonno.jpg" desc="Descrizione 3" />
      </div>
    </div>
  );
}

export default Cards;
