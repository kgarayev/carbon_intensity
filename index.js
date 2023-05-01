import {
  regions,
  POSTCODE_API_URL,
  REGIONAL_API_URL,
  NATIONAL_API_URL_INTENSITY,
  NATIONAL_API_URL_GENERATION,
  GEOCODING_API_URL,
  GEO_TO_POSTCODE_API_URL,
  container,
  geolocationButton,
  regionDropDown,
  compareButton,
  clearButton,
  errorMessage,
} from "./static.js";

// final postcode in suitable format
let finalPostcode;

// user input
let userInput;

// variable for the local data from API
let localApiData;

// variable for the national data from API
let nationalApiData;

// to simplify console.log command
const { log } = console;

// create a postcode schema for validation
const schema = Joi.string().regex(
  /^([A-Z]{1,2}\d{1,2}[A-Z]?)\s*(\d[A-Z]{2})$/i
);

// a joi validator function for postcode
const postcodeValidator = (input) => {
  //   send the data to joi and validate
  Joi.validate(input, schema, { abortEarly: false }, (error, response) => {
    if (error) {
      return false;
    } else {
      finalPostcode = response.replace(/\s+/g, "").slice(0, -3);
      //   log(finalPostcode);
      writeData(finalPostcode, POSTCODE_API_URL, "local");
      errorMessage.innerHTML = "";
      return true;
    }
  });
};

// a function to check whether the user input is a valid location and whether it is in the UK
const locationCheck = async (input) => {
  const isValidPostcode = postcodeValidator(input);
  if (isValidPostcode) {
    return;
  }

  // run it through the api
  const { data } = await axios.get(
    GEOCODING_API_URL.replace(`{address}`, input)
  );

  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].display_name.includes("United Kingdom")) {
        const lat = data[i].lat;
        const long = data[i].lon;
        const coordData = { coords: { latitude: lat, longitude: long } };
        geoToPostcode(coordData);
        return true;
      }
    }
  }
  errorMessage.innerHTML = "Please enter a valid UK area name or postcode";
};

// get data from the user
document.addEventListener("input", (event) => {
  userInput = event.target.value.trim();
});

// submit the final user input and validate
document.getElementById("checkButton").addEventListener("click", (event) => {
  event.preventDefault();
  errorMessage.innerHTML = "";
  container.innerHTML = "";

  if (userInput) {
    locationCheck(userInput);
  }
});

// a function to get data from the API
const getData = async (locationData, url) => {
  const copiedUrl = url.slice();
  const splitUrl = copiedUrl.split("/");
  const replaceable = splitUrl[splitUrl.length - 1];

  //   talk to the api
  if (locationData === "N") {
    // for national data
    // get the data from the api
    let nationalIntensity = await axios.get(NATIONAL_API_URL_INTENSITY);
    let nationalGeneration = await axios.get(NATIONAL_API_URL_GENERATION);

    // move the data such that to create a compatible data structure
    nationalIntensity = nationalIntensity.data.data[0].intensity;
    nationalGeneration = nationalGeneration.data.data;
    nationalGeneration["intensity"] = nationalIntensity;
    nationalApiData = { shortname: "National", data: [nationalGeneration] };

    log(nationalApiData);
    return nationalApiData;
  } else {
    // for regional or local data
    const { data: d } = await axios.get(url.replace(replaceable, locationData));

    localApiData = d.data[0];
    log(localApiData);
    return localApiData;
  }
};

// check and run the data function
const writeData = async (locationData, url, elementId) => {
  if (locationData) {
    const data = await getData(locationData, url);
    displayData(data, elementId);
    regionDropDown.disabled = false;
    compareButton.disabled = false;
    return;
  }
  return;
};

// display the obtained data for the user
const displayData = (data, elementId) => {
  if (data) {
    const region = data.shortname;
    const stats = data.data[0];
    const fromDate = stats.from;
    const toDate = stats.to;
    const intensity = stats.intensity;
    const generationMix = stats.generationmix;

    document.getElementById(container.id).innerHTML = "";

    updateDom(container.id, `div`, ``, elementId);

    updateDom(elementId, `h4`, `Region: ${region}`);
    updateDom(elementId, `h5`, `Date & Time: ${fromDate} - ${toDate}`);
    updateDom(elementId, `p`, `Forecast: ${intensity.forecast}`);
    updateDom(elementId, `p`, `Index: ${intensity.index}`);

    generationMix.forEach((item) => {
      for (let key in item) {
        if (key === "fuel") {
          updateDom(elementId, `h5`, `Fuel Type: `);
          updateDom(elementId, `p`, `${item[key].toUpperCase()}`);
        } else {
          updateDom(elementId, `h5`, `Percentage of Mix: `);
          updateDom(elementId, `p`, `${item[key]}%`);
        }
      }
    });
  }
};

// a function to programmatically update the DOM
const updateDom = (targetId, tag, text, elementId = "") => {
  const content = document.createTextNode(text);
  const element = document.createElement(tag);
  element.id = elementId;
  element.append(content);
  document.getElementById(targetId).append(element);
};

// get the coordinates, convert them to postcode and write the data to the DOM
const geoToPostcode = async ({ coords }) => {
  const { latitude, longitude } = coords;
  log(latitude, longitude);

  let urlCopy = GEO_TO_POSTCODE_API_URL.slice()
    .replace("{longitude}", longitude)
    .replace("{latitude}", latitude);

  const { data } = await axios.get(urlCopy);

  finalPostcode = data.result[0].postcode
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase()
    .slice(0, -3);

  log(finalPostcode);
  writeData(finalPostcode, POSTCODE_API_URL, "local");
};

// geolocation error function
const error = (error) => {
  console.log(error);
};

// geolocation options object
const options = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 2000,
};

// get the geolocation of the user
geolocationButton.addEventListener("click", (event) => {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(geoToPostcode, error, options);
});

// dynamically setting the region options in html
const setRegions = () => {
  for (const regionId in regions) {
    const option = document.createElement("option");
    option.value = regionId;
    option.text = regions[regionId];
    regionDropDown.add(option);
  }
};

// run the set regions function
setRegions();

// listen to compare button and call the API function
compareButton.addEventListener("click", (event) => {
  event.preventDefault();
  const selectedOption = regionDropDown.value;
  //   log(selectedOption);

  if (selectedOption === "N") {
    writeData(selectedOption, NATIONAL_API_URL_INTENSITY, "regional");
  } else {
    writeData(selectedOption, REGIONAL_API_URL, "regional");
  }
});

// clear the container
clearButton.addEventListener("click", (event) => {
  event.preventDefault();
  container.innerHTML = "";
});
