import React from "react";
import Image from "../components/Image";
import Form from "../components/Form";

function UserAccess() {
    const isRegistered = window.location.pathname === "/newAccess" ? "false" : "true";

  return (
    <>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 bg-gray-50">
        <Image src="./images/logo.png" />
        <div className="w-full bg-white rounded-lg md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              {isRegistered === "true" ? "Accedi al tuo account" : "Registrati"}
            </h1>
            <Form isRegistered={isRegistered} />
          </div>
        </div>
      </div>
    </>
  );
}

export default UserAccess;
