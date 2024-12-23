import React from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import App from "./App";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import RecipeDetails from "./pages/RecipesDetails";
import InsertRecipe from "./pages/InsertRecipe";
import UpdateRecipe from "./pages/UpdateRecipe";
import SearchResults from "./pages/SearchResults";
import Menu from "./pages/Menu";

const routes = createBrowserRouter([
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
    path: "/ricetta/inserisci",
    element: (
      <ProtectedRoute>
        <InsertRecipe />
      </ProtectedRoute>
    ),
  },
  {
    path: "/categoria/:id_categoria", // :id è un parametro dinamico
    element: (
      <ProtectedRoute>
        <CategoryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ricetta/:id_recipe", // :id è un parametro dinamico
    element: (
      <ProtectedRoute>
        <RecipeDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ricetta/:id_recipe/modifica", // :id è un parametro dinamico
    element: (
      <ProtectedRoute>
        <UpdateRecipe />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ricerca/:query", // :id è un parametro dinamico
    element: (
      <ProtectedRoute>
        <SearchResults />
      </ProtectedRoute>
    ),
  },

  {
    path: "/menu", // :id è un parametro dinamico
    element: (
      <ProtectedRoute>
        <Menu />
      </ProtectedRoute>
    ),
  },
]);

export default routes;
