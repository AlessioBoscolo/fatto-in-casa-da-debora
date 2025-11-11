import React, { useState } from 'react';
import { Users, BookOpen, UserCheck, Menu, X, Edit, Trash2, Check, CornerDownLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
const { apiUrl } = require("../../config/apiConfig");

const RecipeDashboard = () => {
  const [activePage, setActivePage] = useState('requests');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accessRequests, setAccessRequests] = useState([]);
  const [userAuthorized, setUserAuthorized] = useState([]);
  const [permissionsName, setPermissionsName] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const navigate = useNavigate();
  const { user } = useAuth();
  
  const fetchUsersNotAccepted = async () => {
    try {
      const response = await fetch(`${apiUrl}:3001/api/user/usersNotAccepted`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const retrievedData = await response.json();
        setAccessRequests(retrievedData);      
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchUsersAuthorized = async () => {
    try {
      const response = await fetch(`${apiUrl}:3001/api/user/getUserAuthorized`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const retrievedData = await response.json();
        setUserAuthorized(retrievedData);          
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  React.useEffect(() => {
    const fetchPermissionsName = async () => {
      try {
        const response = await fetch(`${apiUrl}:3001/api/user/getUserPermissions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const retrievedData = await response.json();
          setPermissionsName(retrievedData);          
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUsersNotAccepted();
    fetchPermissionsName();
    fetchUsersAuthorized();
  }, []);  

  const setUserPermission = async (id, role) => {
    try {
      const response = await fetch(
        `${apiUrl}:3001/api/user/setUserPermission`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_user: id,
            id_permission: role,
          }),
        }
      );
      if(response.ok){
        fetchUsersNotAccepted();
        fetchUsersAuthorized();    
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const deleteUserRequest = async (id) => {
    try {
      const response = await fetch(
        `${apiUrl}:3001/api/user/deleteUserRequest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_user: id,
          }),
        }
      );
      if(response.ok){
        fetchUsersNotAccepted();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const handleAcceptRequest = async (id, role) => {
    setUserPermission(id, role)
  };

  const handleRejectRequest = async (id) => {
    deleteUserRequest(id);
  };

  const handleChangeRole = (userId, newRole) => {
    setUserPermission(userId, newRole)
  };

  const handleDeleteRecipe = (id) => {
    setRecipes(recipes.filter(r => r.id !== id));
  };

  const handleEditRecipe = (id) => {
    alert(`Modifica ricetta con ID: ${id}`);
  };

  const checkSetActivePage = (id_page) => {
    if(id_page === "home"){
      navigate("/home");
    } else {
      setActivePage(id_page);
      setSidebarOpen(false); // Chiude la sidebar su mobile dopo la selezione
    }
  }

  const roleColors = {
    Administrator: 'bg-red-100 text-red-800',
    Manager: 'bg-blue-100 text-blue-800',
    User: 'bg-green-100 text-green-800'
  };

  const menuItems = [
    { id: 'requests', label: 'Richieste Accesso', icon: UserCheck },
    { id: 'users', label: 'Gestione Utenti', icon: Users },
    { id: 'recipes', label: 'Gestione Ricette', icon: BookOpen },
    { id: 'home', label: 'Ritorna alla Home', icon: CornerDownLeft },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Overlay per mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarOpen ? 'w-64' : 'w-0 lg:w-64'}
        bg-white shadow-lg transition-all duration-300
        overflow-hidden
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Dashboard Ricette</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="space-y-2">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => checkSetActivePage(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activePage === item.id
                      ? 'bg-red-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm lg:text-base">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto w-full">
        {/* Header */}
        <div className="bg-white shadow-sm p-3 lg:p-4 flex items-center sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg mr-2 lg:mr-4"
          >
            <Menu size={24} />
          </button>
          <h2 className="text-base lg:text-xl font-semibold text-gray-800 truncate">
            {menuItems.find(item => item.id === activePage)?.label}
          </h2>
        </div>

        {/* Content Area */}
        <div className="p-3 lg:p-6">
          {/* Richieste di Accesso */}
          {activePage === 'requests' && (
            <div className="space-y-4">
              {accessRequests.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 lg:p-8 text-center text-gray-500">
                  Nessuna richiesta in sospeso
                </div>
              ) : (
                accessRequests.map(request => (
                  <div key={request.id_utente} className="bg-white rounded-lg shadow p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-base lg:text-lg font-semibold text-gray-800">
                          {request.nome_utente} {request.cognome_utente}
                        </h3>
                        <p className="text-sm lg:text-base text-gray-600 break-all">{request.email_utente}</p>
                        <p className="text-xs lg:text-sm text-gray-500 mt-1">Richiesta il: {request.date_request}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <select
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                          id={`role-${request.id_utente}`}
                        >
                          {permissionsName.map(permission => (
                            <option key={permission.id_permesso} value={permission.id_permesso}>
                              {permission.nome_permesso}
                            </option>
                          ))}
                        </select>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const role = document.getElementById(`role-${request.id_utente}`).value;
                              handleAcceptRequest(request.id_utente, role);
                            }}
                            className="flex-1 sm:flex-none px-3 lg:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 text-sm"
                          >
                            <Check size={16} />
                            <span>Accetta</span>
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request.id_utente)}
                            className="flex-1 sm:flex-none px-3 lg:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2 text-sm"
                          >
                            <X size={16} />
                            <span>Rifiuta</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Gestione Utenti */}
          {activePage === 'users' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Vista mobile - Cards */}
              <div className="block lg:hidden">
                {userAuthorized.map(utente => (
                  <div key={utente.id_utente} className="p-4 border-b border-gray-200">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Nome</p>
                        <p className="font-medium text-gray-900">{utente.nome_utente} {utente.cognome_utente}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-sm text-gray-700 break-all">{utente.email_utente}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Ruolo</p>
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColors[utente.nome_permesso]}`}>
                          {utente.nome_permesso}
                        </span>
                      </div>
                      {utente.id_utente !== user.id_utente && utente.email_utente !== 'boscolo.alessio1@gmail.com' && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Cambia ruolo</p>
                          <select
                            value={utente.permesso_utente}
                            onChange={(e) => handleChangeRole(utente.id_utente, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                          >
                            {permissionsName.map(permission => (
                              <option key={permission.id_permesso} value={permission.id_permesso}>
                                {permission.nome_permesso}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Vista desktop - Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cognome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ruolo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Azioni
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userAuthorized.map(utente => (
                      <tr key={utente.id_utente}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{utente.nome_utente}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{utente.cognome_utente}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{utente.email_utente}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColors[utente.nome_permesso]}`}>
                            {utente.nome_permesso}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {utente.id_utente === user.id_utente || utente.email_utente === 'boscolo.alessio1@gmail.com' ? (
                            <span className="text-gray-400">-</span>
                          ) : (
                            <select
                              value={utente.permesso_utente}
                              onChange={(e) => handleChangeRole(utente.id_utente, e.target.value)}
                              className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                              {permissionsName.map(permission => (
                                <option key={permission.id_permesso} value={permission.id_permesso}>
                                  {permission.nome_permesso}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Gestione Ricette */}
          {activePage === 'recipes' && (
            <div className="space-y-4">
              {recipes.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 lg:p-8 text-center text-gray-500">
                  Working in progress...
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  {/* Vista mobile - Cards */}
                  <div className="block lg:hidden">
                    {recipes.map(recipe => (
                      <div key={recipe.id} className="p-4 border-b border-gray-200">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-gray-900">{recipe.title}</h3>
                          <div className="text-sm text-gray-600">
                            <p><span className="font-medium">Categoria:</span> {recipe.category}</p>
                            <p><span className="font-medium">Autore:</span> {recipe.author}</p>
                            <p><span className="font-medium">Data:</span> {recipe.date}</p>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => handleEditRecipe(recipe.id)}
                              className="flex-1 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center space-x-2"
                            >
                              <Edit size={16} />
                              <span className="text-sm">Modifica</span>
                            </button>
                            <button
                              onClick={() => handleDeleteRecipe(recipe.id)}
                              className="flex-1 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center space-x-2"
                            >
                              <Trash2 size={16} />
                              <span className="text-sm">Elimina</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Vista desktop - Table */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Titolo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Categoria
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Autore
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Azioni
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recipes.map(recipe => (
                          <tr key={recipe.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{recipe.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{recipe.category}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{recipe.author}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{recipe.date}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditRecipe(recipe.id)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Modifica"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => handleDeleteRecipe(recipe.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Elimina"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDashboard;