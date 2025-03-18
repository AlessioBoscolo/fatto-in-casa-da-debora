import React from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import App from "./App";
import Home from "./pages/Home";

// Incucinacondebora

import CategoryPage from "./pages/CategoryPage";
import RecipeDetails from "./pages/RecipesDetails";
import InsertRecipe from "./pages/InsertRecipe";
import UpdateRecipe from "./pages/UpdateRecipe";
import SearchResults from "./pages/SearchResults";
import Menu from "./pages/Menu/Menu";
import Archivio from "./pages/Menu/Archivio";
import Archivio_Menu from "./pages/Menu/Archivio_Menu";
import ModifyMenuDay from "./pages/Menu/ModifyMenuDay";

// GallanzScheduler

import Home_Scheduler from "./pages/Scheduler/Home_Scheduler.jsx";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
  },
  {
    path: "/newAccess",
    element: <App></App>,
  },

  // Incucinacondebora

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

  {
    path: "menu/archivio", // :id è un parametro dinamico
    element: (
      <ProtectedRoute>
        <Archivio />
      </ProtectedRoute>
    ),
  },

  {
    path: "menu/archivio/:id_archivio", // :id è un parametro dinamico
    element: (
      <ProtectedRoute>
        <Archivio_Menu />
      </ProtectedRoute>
    ),
  },

  {
    path: "menu/modificaMenu",
    element: (
      <ProtectedRoute>
        <ModifyMenuDay />
      </ProtectedRoute>
    ),
  },

  // GallanzScheduler

  {
    path: "GallanzScheduler",
    element: (
      <ProtectedRoute>
        <Home_Scheduler />
      </ProtectedRoute>
    ),
  },

]);

export default routes;
