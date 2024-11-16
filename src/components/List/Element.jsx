import React from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Element(props) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/user/logout", {
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
          <button onClick={handleClick}>{props.value}</button>
        </Link>
      );
    } else {
      return <button onClick={handleClick}>{props.value}</button>;
    }
  }

  return <li className={props.className}>{composeElement()}</li>;
}

export default Element;
