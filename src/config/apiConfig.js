const getApiUrl = () => {
  const environment = "development";

  if (environment === "development") {
    return "http://localhost";
  } else {
    return "https://api.incucinacondebora.it";
  }
};

module.exports = {
  apiUrl: getApiUrl(),
};
