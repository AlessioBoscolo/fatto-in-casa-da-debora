require("dotenv").config();

const getApiUrl = () => {
  // Usa ?? per fornire un valore di default se NODE_ENV è undefined
  const environment = process.env.NODE_ENV ?? "development";

  if (process.env.NODE_ENV === "production") {
    return process.env.API_URL_PRODUCTION;
  } else {
    return process.env.API_URL_LOCAL;
  }
};

module.exports = {
  apiUrl: getApiUrl(),
  isDevelopment: () =>
    (process.env.NODE_ENV ?? "development") === "development",
  isProduction: () => process.env.NODE_ENV === "production",
};
