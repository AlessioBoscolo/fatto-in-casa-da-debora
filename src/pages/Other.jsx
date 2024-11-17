import React from "react";
import Navbar from "../components/Navbar/Navbar";

function Other(){

    document.getElementsByTagName('title').value = "Other"

    return (
        <>
          <Navbar />
          <h1>Other</h1>
        </>
      );
}

export default Other;