import React from "react";
import { Link } from "react-router-dom";

//imported components
import Label from "./Label";
import Input from "./Input";

function Form(props) {
  const needToRegister = props.needToRegister != null && true;
  console.log(needToRegister);

  return (
    <>
      <form className="space-y-4 md:space-y-6" action={props.action}>
        <div>
          <Label
            for="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          />
          <Input
            type="email"
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            placeholder="name@gmail.com"
            isRequired="true"
          />
        </div>
        <div>
          <Label
            for="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          />
          <Input
            type="password"
            name="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            placeholder="************"
            isRequired="true"
          />
        </div>

        <Link to="/newAccess">Non hai un account? Registrati</Link>

        <button
          type="submit"
          className="w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Accedi
        </button>
      </form>
    </>
  );
}

export default Form;
