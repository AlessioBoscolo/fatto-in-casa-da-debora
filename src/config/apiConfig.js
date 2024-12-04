const getApiUrl = () => {
  const environment = "production";

  if (environment === "production") {
    return "https://api.incucinacondebora.it";
  } else {
    return "http://localhost";
  }
};

console.log(getApiUrl());


module.exports = {
  apiUrl: getApiUrl(),
};
