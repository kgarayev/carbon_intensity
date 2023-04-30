// set a variable with the API URL
const API_URL = `https://api.carbonintensity.org.uk/regional/postcode/{postcode}`;

// variable for the data from API
let apiData;

// select the html element(s)
const container = document.getElementById("container");

// user input
let userInput = ``;

// to simplify console.log command
const { log } = console;

// get data from the user
document.addEventListener("input", (event) => {
  userInput = event.target.value;
  log(userInput);
});

document.getElementById("button").addEventListener("click", (event) => {
  event.preventDefault();
  userInput = convert(userInput);
  log("shortened input is:", userInput);
});

// validate data from the user

// convert the full postcode into the outward postcode
const convert = (fullPostcode) => {
  let outwardPostcode = fullPostcode.split(" ")[0];
  return outwardPostcode;
};

// a function to get data from the API

// display the obtained data for the user

// update the data for the user
