/*
  Config api key here and export it as config module in src folder 
  for use in file [ app.js ]  
*/
const dotenv = require("dotenv").config();

const config_api = {
  apiKey: process.env.API_KEY,
};

module.exports = config_api;
