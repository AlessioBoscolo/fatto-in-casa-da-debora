import React from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import App from "./App";
import Contacts from "./pages/Contacts";
import About from "./pages/About";
import Other from "./pages/Other";
import Home from "./pages/Home";

const route = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
  },
  {
    path: "/about",
    element: <About></About>,
  },
  {
    path: "/contacts",
    element: <Contacts></Contacts>,
  },
  {
    path: "/other",
    element: <Other></Other>,
  },
  {
    path: "/newAccess",
    element: <App></App>,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
]);

export default route;
