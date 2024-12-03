import React from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Element(props) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://api.incucinacondebora.it:3001/api/user/logout", {
        method: "POST",
      });

      if (response.ok) {
        logout();
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const handleClick = eval(props.click);
  function composeElement() {
    if (props.path !== null) {
      return (
        <Link to={props.path}>
          <span
            onClick={handleClick}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {props.value}
          </span>
        </Link>
      );
    } else {
      return (
        <span
          onClick={handleClick}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          {props.value}
        </span>
      );
    }
  }

  return composeElement();
}

export default Element;
