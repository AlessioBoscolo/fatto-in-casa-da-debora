import React from "react";
import { Link } from "react-router-dom";

//imported components
import Label from "./Label";
import Input from "./Input";

//importing form field
import userAccess from "../formValues";

function Form(props) {
  const isRegistered = props.isRegistered;
  const formField = userAccess;

  return (
    <>
      <form className="space-y-4 md:space-y-6" action="">
        {Object.entries(formField).map(([key, field]) =>
            field.isOnlyRegistration === false || field.isOnlyRegistration === null ? (
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
                isRequired={field.isRequired === true ? true : false}
              />
            </div>) : ( field.isOnlyRegistration !== isRegistered && (
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
            )))}

        <div className="top-4 text-red-500">
          {isRegistered === true ? (
            <Link to="/newAccess">Non hai un account? Registrati</Link>
          ) : (
            <Link to="/">Hai già un account? Accedi</Link>
          )}
        </div>

        <Link to={"/home"}>
          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border"
          >
            {isRegistered === true ? "Accedi" : "Registrati"}
          </button>
        </Link>
      </form>
    </>
  );
}

export default Form;
