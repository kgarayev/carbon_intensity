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

import { log } from "./helpers.js";

// get data from the user
document.addEventListener("input", (event) => {
  userInput = event.target.value.trim();
});

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
      let postcodeCopy = finalPostcode.slice();
      postcodeCopy = response.replace(/\s+/g, "").slice(0, -3);
      //   log(finalPostcode);
      writeData(postcodeCopy, POSTCODE_API_URL);
      return true;
    }
  });
};

// a function to check whether the user input is a valid location and whether it is in the UK
const locationCheck = async (input) => {
  // run it through the api
  const { data } = await axios.get(
    GEOCODING_API_URL.replace(`{address}`, input)
  );
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].display_name.includes("United Kingdom")) {
        const lat = data[i].lat;
        const long = data[i].lon;
        // log(longitude, latitude);
        const coordData = { coords: { latitude: lat, longitude: long } };
        // const { lat, long } = coords;
        // log(lat, long);
        geoToPostcode(coordData);
        return;
        // return coords;
      }
    }
    errorMessage.innerHTML = "Please enter a valid UK area name or postcode";
  } else {
    errorMessage.innerHTML = "Please enter a valid UK area name or postcode";
  }

  // log(data[0].display_name.includes("United Kingdom"));
};

// locationCheck("paris");

// submit the final user input and validate
document.getElementById("checkButton").addEventListener("click", (event) => {
  event.preventDefault();

  if (userInput) {
    // check if the input is a valid UK postcode
    if (!postcodeValidator(userInput)) {
      // if not a valid postcode, pass it through geocode API to check if it is a valid location and it is in the UK
      locationCheck(userInput);
    }
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
const writeData = async (locationData, url) => {
  if (locationData) {
    const data = await getData(locationData, url);
    displayData(data);
    return;
  }
  return;
};

// display the obtained data for the user
const displayData = (data) => {
  if (data) {
    const region = data.shortname;
    const stats = data.data[0];
    const fromDate = stats.from;
    const toDate = stats.to;
    const intensity = stats.intensity;
    const generationMix = stats.generationmix;

    // log(fromDate);

    document.getElementById(container.id).innerHTML = "";

    updateDom(container.id, `h4`, `Region: ${region}`);
    updateDom(container.id, `h5`, `Date & Time: ${fromDate} - ${toDate}`);
    updateDom(container.id, `p`, `Forecast: ${intensity.forecast}`);
    updateDom(container.id, `p`, `Index: ${intensity.index}`);

    generationMix.forEach((item) => {
      //   log(item);
      for (let key in item) {
        if (key === "fuel") {
          updateDom(container.id, `h5`, `Fuel Type: `);
          updateDom(container.id, `p`, `${item[key].toUpperCase()}`);
        } else {
          updateDom(container.id, `h5`, `Percentage of Mix: `);
          updateDom(container.id, `p`, `${item[key]}%`);
        }

        // log(key, item[key]);
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
  writeData(finalPostcode, POSTCODE_API_URL);
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

setRegions();

// listen to compare button and call the API function
compareButton.addEventListener("click", (event) => {
  event.preventDefault();
  const selectedOption = regionDropDown.value;
  //   log(selectedOption);

  if (selectedOption === "N") {
    writeData(selectedOption, NATIONAL_API_URL_INTENSITY);
  } else {
    writeData(selectedOption, REGIONAL_API_URL);
  }
});

clearButton.addEventListener("click", (event) => {
  event.preventDefault();
  container.innerHTML = "";
});
