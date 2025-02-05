import React from "react";

import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";

function Archivio_Menu() {
  const { id_archivio } = useParams();

  return (
    <>
      <Navbar />
      {id_archivio}
      <Footer />
    </>
  );
}

export default Archivio_Menu;
