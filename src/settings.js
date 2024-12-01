import React from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import App from "./App";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";

const route = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
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
  {
    path: "/categoria/:id_categoria",  // :id è un parametro dinamico
    element: (
      <ProtectedRoute>
        <CategoryPage />
      </ProtectedRoute>
    ),
  },
]);

export default route;
