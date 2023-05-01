// set a variable with the API URL
const API_URL = `https://api.carbonintensity.org.uk/regional/postcode/{postcode}`;

// variable for the data from API
let apiData;

// select the html element(s)
const container = document.getElementById("container");

// user input
let userInput = ``;

// final postcode in suitable format
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
document.getElementById("checkButton").addEventListener("click", (event) => {
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
  return apiData;
};

// check and run the data function
const writeData = async () => {
  if (finalPostcode.length > 0) {
    const data = await getData(finalPostcode);
    displayData(data);
    return;
  } else {
    return;
  }
};

// display the obtained data for the user
const displayData = (data) => {
  if (data) {
    const region = data.shortname;
    const fromDate = data.data[0].from;
    const toDate = data.data[0].to;
    const intensity = data.data[0].intensity;
    const generationMix = data.data[0].generationmix;

    log(fromDate);

    updateDom(container.id, `h4`, `Region: ${region}`);
    updateDom(container.id, `h5`, `Date & Time: ${fromDate} - ${toDate}`);
    updateDom(container.id, `p`, `Forecast: ${intensity.forecast}`);
    updateDom(container.id, `p`, `Index: ${intensity.index}`);

    generationMix.forEach((item) => {
      log(item);
      for (let key in item) {
        if (key === "fuel") {
          updateDom(container.id, `h5`, `Fuel Type: `);
          updateDom(container.id, `p`, `${item[key].toUpperCase()}`);
        } else {
          updateDom(container.id, `h5`, `Percentage of Mix: `);
          updateDom(container.id, `p`, `${item[key]}%`);
        }

        log(key, item[key]);
      }
    });
  }
};

// a function to programmatically update the DOM
const updateDom = (id, tag, text) => {
  const content = document.createTextNode(text);
  const element = document.createElement(tag);
  element.append(content);
  document.getElementById(id).append(element);
};

// get the coordinates, convert them to postcode and write the data to the DOM
const geoToPostcode = async ({ coords }) => {
  const { latitude, longitude } = coords;
  log(latitude, longitude);

  const { data } = await axios.get(
    `https://api.postcodes.io/postcodes?lon=${longitude}&lat=${latitude}`
  );

  finalPostcode = data.result[0].postcode
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase()
    .slice(0, -3);

  log(finalPostcode);
  writeData();
};

const error = (error) => {
  console.log(error);
};

const options = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 2000,
};

// get the geolocation of the user
document
  .getElementById("geolocationButton")
  .addEventListener("click", (event) => {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(geoToPostcode, error, options);
  });
