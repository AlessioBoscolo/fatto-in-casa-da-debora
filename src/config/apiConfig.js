const getApiUrl = () => {
  const environment = "";

  if (environment === "development") {
    return "http://localhost";
  } else {
    return "https://api.incucinacondebora.it";
  }
};

module.exports = {
  apiUrl: getApiUrl(),
};
