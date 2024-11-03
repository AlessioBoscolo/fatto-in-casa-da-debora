import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <ul>
      <li>
        <Link to={"/"}>Home</Link>
      </li>
      <li>
        <Link to={"/contacts"}>Contacts</Link>
      </li>
      <li>
        <Link to={"/about"}>About</Link>
      </li>
      <li>
        <Link to={"/other"}>Other</Link>
      </li>
    </ul>
  );
}

export default Navbar;
