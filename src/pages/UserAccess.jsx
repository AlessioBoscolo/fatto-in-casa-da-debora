import React from "react";
import Image from "../components/Image";
import Form from "../components/Form/Form";
import backgroundImage from "../images/backgroundImage.png";

function UserAccess() {
  const isRegistered = window.location.pathname === "/newAccess" ? false : true;
  const action = isRegistered ? "/home": "/";

  return (
    <>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 bg-red-500">
        <div className="w-full bg-white rounded-lg md:mt-0 sm:max-w-md xl:p-0">
          <div className="flex justify-center items-center pt-2">
            <Image src="./images/logo.png" className="center" />
          </div>
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              {isRegistered === true ? "Accedi al tuo account" : "Registrati"}
            </h1>
            <Form isRegistered={isRegistered} action={action} method="POST" />
          </div>
        </div>
      </div>
    </>
  );
}

export default UserAccess;