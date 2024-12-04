import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "./Image";

const { apiUrl } = require('../config/apiConfig');

function Carousel(props) {
  const [randomRecipe, setRandomRecipe] = React.useState([]);

  React.useEffect(() => {
    fetchRandomRecipe();
  }, [props.nrRandomRecipe]);

  const fetchRandomRecipe = async () => {
    try {
      const response = await fetch(
        `${apiUrl}:3001/api/category/getRandomRecipe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nrRandomRecipe: props.nrRandomRecipe,
          }),
        }
      );

      if (response.ok) {
        const retrievedData = await response.json();
        setRandomRecipe(retrievedData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  function getLinkImage() {
    return Object.values(randomRecipe)
      .map((recipe) => recipe?.image_path_ricetta || "")
      .filter((path) => path); // Rimuove eventuali stringhe vuote
  }

  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/75 rounded-full"
    >
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/75 rounded-full"
    >
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    arrows: true,
    accessibility: true,
    focusOnSelect: false,
  };

  const images = getLinkImage();

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="w-full md:w-9/12 mt-24">
        <Slider {...settings}>
          {images.map((src, index) => (
            <div key={index}>
              <div>
                <Image
                  src={src}
                  className="w-full h-56 md:h-96 object-cover"
                  alt={`Slide ${index + 1} - Immagine del piatto`}
                  tabIndex={0}
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Carousel;
