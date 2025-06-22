import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import Icon from "./Icon";

function Search(props) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const navigate = useNavigate();
  const { id_categoria } = useParams();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {      
      navigate(`/ricerca/${encodeURIComponent(searchTerm.trim())}`, {state: { research: props.research, categoryIntoSearch: id_categoria}});
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-gray-100 border-transparent focus-within:border-blue-500 focus-within:bg-transparent flex px-6 rounded-full h-10 lg:w-2/4 mt-3 mx-auto max-lg:mt-6"
    >
      <Icon title="search"></Icon>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Cerca..."
        className="w-full outline-none bg-transparent text-gray-600 font-semibold text-[15px]"
        name="element_searched"
      />
    </form>
  );
}

export default Search;
