import React, {useState} from "react";
import { Link } from "react-router-dom";

//imported components
import Label from "./Label";
import Input from "./Input";

//importing form field
import userAccess from "../../form/formValues";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Form(props) {
  const isRegistered = props.isRegistered;
  const formField = userAccess;
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null); // Add this line

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formValues = Object.fromEntries(formData.entries());

    if ((formValues.password !== formValues.confirm_password) && !isRegistered) {
      setError("Le password non corrispondono");
      return;
    }

    try {
      const endpoint = isRegistered ? "/api/login" : "/api/register";
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formValues.name,
          surname: formValues.surname,
          email: formValues.email,
          password: formValues.password,
        }),
      });

      if (response.ok) {
        console.log(response);
        const userData = await response.json();
        login(userData);
        navigate("/home");
        // Handle successful login/registration
        // For example, store user data in context/state
        // Redirect to dashboard
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      console.error("Error:", error);
      // Show error message to user
    }
  };

  return (
    <>
      {error && (
        <div
          className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
      )}

      <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
        {Object.entries(formField).map(([key, field]) =>
          field.isOnlyRegistration === false ||
          field.isOnlyRegistration === null ? (
            <div key={key}>
              <Label
                for={key}
                className="block mb-2 text-sm font-medium text-gray-900"
                value={field.value}
              />
              <Input
                type={field.type}
                name={key}
                id={key}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder={field.placeholder}
                isRequired={field.isRequired}
              />
            </div>
          ) : (
            field.isOnlyRegistration !== isRegistered && (
              <div key={key}>
                <Label
                  for={key}
                  className="block mb-2 text-sm font-medium text-gray-900"
                  value={field.value}
                />
                <Input
                  type={
                    key === "password" || key === "confirm_password"
                      ? "password"
                      : "text"
                  }
                  name={key}
                  id={key}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder={field.placeholder}
                  isRequired={field.isRequired === true ? true : false}
                />
              </div>
            )
          )
        )}

        <div className="top-4 text-red-500 hover:text-red-700">
          {isRegistered === true ? (
            <Link to="/newAccess">Non hai un account? Registrati</Link>
          ) : (
            <Link to="/">Hai già un account? Accedi</Link>
          )}
        </div>

        <Input
          className="w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border"
          type="submit"
          value={isRegistered === true ? "Accedi" : "Registrati"}
        />
        {/* <Link to={"/home"}>
          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border"
          >
            {isRegistered === true ? "Accedi" : "Registrati"}
          </button>
        </Link> */}
      </form>
    </>
  );
}

export default Form;
