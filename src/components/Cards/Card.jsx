import React from "react";
import { Link } from "react-router-dom";

import Image from "../Image";

function Card(props) {
  return (
    <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow">
      <a href="">
        <Image className="rounded-t-lg" src={props.src} alt="" />
      </a>
      <div className="p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-black">
          {props.title}
        </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {props.desc}
        </p>
        <Link
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
          to={"/ricetta/" + props.id_ricetta}
        >
          Prepara ora!
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="https://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default Card;
