// set a variable with the API URL
const API_URL = `https://api.carbonintensity.org.uk/regional/postcode/{postcode}`;

// variable for the data from API
let apiData;

// select the html element(s)
const container = document.getElementById("container");

// user input
let userInput = ``;

// final postcode obtained from the user
let finalPostcode = ``;

// to simplify console.log command
const { log } = console;

// get data from the user
document.addEventListener("input", (event) => {
  userInput = event.target.value.trim().replace(/\s+/g, "").toUpperCase();
});

// create a schema for validation
const schema = Joi.string().regex(
  /^([A-Z]{1,2}\d{1,2}[A-Z]?)\s*(\d[A-Z]{2})$/i
);

// submit the final user input and validate
document.getElementById("button").addEventListener("click", (event) => {
  event.preventDefault();

  //   send the data to joi and validate
  Joi.validate(userInput, schema, { abortEarly: false }, (error, response) => {
    log(error, response);

    if (error) {
      document.getElementById("postcodeError").innerHTML =
        "Please enter a valid UK postcode";
    } else {
      finalPostcode = response.slice(0, -3);
      log(finalPostcode);
      writeData();
    }
  });
});

// a function to get data from the API
const getData = async (postcode) => {
  // talk to the api
  const { data } = await axios.get(API_URL.replace("{postcode}", postcode));

  apiData = data.data[0];
  log(apiData.data[0].generationmix);
};

// check and run the data function
const writeData = () => {
  if (finalPostcode.length > 0) {
    getData(finalPostcode);
    return;
  } else {
    return;
  }
};

// display the obtained data for the user
const displayData = (data) => {
  const region = data.shortname;
  const intensity = data.data[0].intensity;
  const generationMix = data.data[0].generationmix;

  const html = ``;
};

// update the data for the user
