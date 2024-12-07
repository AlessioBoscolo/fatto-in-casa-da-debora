import React from "react";

import Image from "./Image";

function Footer() {
  return (
    <footer className="mt-24 bg-red-500">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0 bg-white rounded-xl">
            <Image
              src="./images/logo.png"
              className="me-3"
              alt="Fatto in casa da Debora Logo"
            />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-2">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-white uppercase">
                Follow us
              </h2>
              <ul className="text-white font-medium">
                <li className="mb-4">
                  <a href="#" className="hover:no-underline hover:text-white">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:no-underline hover:text-white">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-white uppercase">
                Legal
              </h2>
              <ul className="text-white font-medium">
                <li className="mb-4">
                  <a href="#" className="hover:no-underline hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:no-underline hover:text-white">
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-white sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-end sm:justify-between">
          <span className="text-sm text-white sm:text-center">
            © 2024 In cucina con Debora™ . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
