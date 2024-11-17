import React from "react";
import { Link } from "react-router-dom";

import Input from "../Form/Input";
import Image from "../Image";
import List from "../List/List";

function Navbar() {

  return (
    <div className="navbar">
      <div className="flex-1 navbar-start">
        <Link to="/home">
          <button className="btn btn-ghost normal-case text-xl h-[70px]">
            <Image
              src="./images/logo.png"
              alt=""
              width="200px"
              height="100px"
            />
          </button>
        </Link>
      </div>
      <div className="flex-none gap-2 navbar-center">
        <div>
          <form action="">
            <Input
              type="text"
              name="search"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto md:block hidden "
            />
            <Input className="hidden" type="submit" />
          </form>
        </div>
      </div>

      <div className="flex-1 navbar-end">
        <Link to="/menu">
          <button className="btn btn-ghost menu menu-horizonta ">
            Menu
          </button>
        </Link>
        <Link to="/ricette">
          <button className="btn btn-ghost menu menu-horizontal">
            Tutte le Ricette
          </button>
        </Link>
        <List title="category"/>
      </div>

      <div className="flex-1 navbar-end md:mr-0">
        <List title="userAccess"/>

      </div>

      <button className="btn btn-ghost btn-circle md:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  );
}

export default Navbar;
