import React from "react";
import { Link } from "react-router-dom";

import Input from "../Form/Input";
import Image from "../Image";
import List from "../List/List";
import Icon from "../Icon";
import Search from "../Search";

function Navbar() {
  const isHome = window.location.pathname === "/home" ? true : false;

  function handleClick() {
    var collapseMenu = document.getElementById("collapseMenu");

    if (collapseMenu.style.display === "block") {
      collapseMenu.style.display = "none";
    } else {
      collapseMenu.style.display = "block";
    }
  }

  return (
    <header className="bg-white font-sans min-h-[60px] px-10 py-2 relative tracking-wide relative z-50">
      <div className="border-b flex flex-wrap items-center max-lg:gap-y-6 max-sm:gap-x-4">
        <a href="">
          <Image src="./images/logo.png" alt="logo" className="w-36" />
        </a>

        <div
          id="collapseMenu"
          className="max-lg:hidden lg:!flex lg:items-center max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-40 max-lg:before:inset-0 max-lg:before:z-50"
        >
          <button
            id="toggleClose"
            className="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white p-3"
            onClick={handleClick}
          >
            <Icon title="close-menu" notificationNr="0"></Icon>

          </button>

          <ul className="lg:flex lg:gap-x-10 lg:absolute lg:left-1/2 lg:-translate-x-1/2 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-2/3 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:px-10 max-lg:py-4 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
            <li className="mb-6 hidden max-lg:block">
              <a href="">
                <Image src=" ./images/logo.png" alt="logo" className="w-36" />
              </a>
            </li>
            <li className="max-lg:border-b max-lg:py-3">
              <a
                href=""
                className="hover:text-red-700 text-[15px] text-red-500 block font-bold"
              >
                Home
              </a>
            </li>
            <li className="group max-lg:border-b max-lg:py-3 relative">
              <List title="category"></List>
            </li>
            <li className="group max-lg:border-b max-lg:py-3 relative">
              <List title="userAccess"></List>
            </li>
          </ul>
        </div>

        <div className="flex items-center ml-auto space-x-8">
          <Icon title="heart" notificationNr="0"></Icon>
          <Icon title="cart" notificationNr="4"></Icon>
          <Icon title="bell" notificationNr="1"></Icon>

          <button id="toggleOpen" className="lg:hidden" onClick={handleClick}>
            <Icon title="open-menu"></Icon>
          </button>
        </div>
      </div>
      {isHome && <Search></Search>}
    </header>
  );
}

export default Navbar;
