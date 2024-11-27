import React from "react";

import Icon from "./Icon";
import Input from "./Form/Input";

function Search() {
  return (
    <div className="bg-gray-100 border-transparent focus-within:border-blue-500 focus-within:bg-transparent flex px-6 rounded-full h-10 lg:w-2/4 mt-3 mx-auto max-lg:mt-6">
      <Icon title="search"></Icon>
      <Input
        type="text"
        placeholder="Cerca..."
        className="w-full outline-none bg-transparent text-gray-600 font-semibold text-[15px]"
      />
    </div>
  );
}

export default Search;
