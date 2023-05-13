import {
  regions,
  POSTCODE_API_URL,
  REGIONAL_API_URL,
  NATIONAL_API_URL_INTENSITY,
  NATIONAL_API_URL_GENERATION,
  GEOCODING_API_URL,
  UK_POSTCODE_VALIDATOR,
  GEO_TO_POSTCODE_API_URL,
  container,
  geolocationButton,
  regionDropDown,
  compareButton,
  clearButton,
  errorMessage,
  errorText,
  inputBox,
  spinner,
} from "./static.js";

import { log, timeStampToLocal, currentISO } from "./utils.js";

// final postcode in suitable format
let finalPostcode;

// user input
let userInput;

// variable for the local data from API
let localApiData;

// variable for the national data from API
let nationalApiData;

// ---------------------------------------------------------------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ---------------------------------------------------------------------------------------------------------------------------

// MAIN EVENT LISTENERS:
// get data from the user
document.addEventListener("input", (event) => {
  userInput = event.target.value.trim();
  checkButton.disabled = false;
  checkButton.classList.remove("offButton");
  checkButton.classList.add("onButton");
  inputBox.classList.remove("offButton");
  inputBox.classList.add("onButton");
});

// submit the final user input and validate
document.getElementById("checkButton").addEventListener("click", (event) => {
  event.preventDefault();
  errorMessage.innerHTML = "";
  container.innerHTML = "";
  regionDropDown.selectedIndex = 0;
  // inputBox.value = "";

  if (userInput) {
    locationCheck(userInput);
  } else {
    errorMessage.innerHTML = errorText[0];
    return;
  }
});

// listen to compare button and call the API function
compareButton.addEventListener("click", (event) => {
  event.preventDefault();
  const selectedOption = regionDropDown.value;
  log(selectedOption);
  if (selectedOption == 0) {
    errorMessage.innerHTML = errorText[2];
    return;
  }
  inputBox.value = "";

  if (selectedOption === "N") {
    writeData(selectedOption, NATIONAL_API_URL_INTENSITY, "regional");
  } else {
    writeData(selectedOption, REGIONAL_API_URL, "regional");
  }
  regionDropDown.disabled = true;
  compareButton.disabled = true;
  regionDropDown.classList.remove("offButton");
  regionDropDown.classList.add("onButton");
  checkButton.classList.add("offButton");
  checkButton.classList.remove("onButton");
  compareButton.classList.add("offButton");
  compareButton.classList.remove("onButton");
});

// clear the container
clearButton.addEventListener("click", (event) => {
  event.preventDefault();
  errorMessage.innerHTML = "";
  container.innerHTML = "";
  inputBox.value = "";
  regionDropDown.selectedIndex = 0;
  checkButton.disabled = true;
  regionDropDown.disabled = true;
  compareButton.disabled = true;
  clearButton.disabled = true;
  geolocationButton.classList.add("offButton");
  geolocationButton.classList.remove("onButton");
  checkButton.classList.add("offButton");
  checkButton.classList.remove("onButton");
  compareButton.classList.add("offButton");
  compareButton.classList.remove("onButton");
  clearButton.classList.add("offButton");
  clearButton.classList.remove("onButton");
  regionDropDown.classList.add("offButton");
  regionDropDown.classList.remove("onButton");
});

// ---------------------------------------------------------------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ---------------------------------------------------------------------------------------------------------------------------

// VALIDATOR FUNCTIONS:
// create a postcode schema for validation
const schema = Joi.string().regex(
  /^([A-Z]{1,2}\d{1,2}[A-Z]?)\s*(\d[A-Z]{2})$/i
);

// a joi validator function for postcode
const postcodeValidator = (input) => {
  return new Promise((resolve, reject) => {
    //   send the data to joi and validate
    Joi.validate(input, schema, { abortEarly: false }, (error, response) => {
      if (error) {
        resolve(false);
      } else {
        finalPostcode = response.replace(/\s+/g, "").slice(0, -3);
        //   log(finalPostcode);

        errorMessage.innerHTML = "";
        resolve(true);
      }
    });
  });
};

// ensure that the postcode is a valid UK postcode
const checkUKPostcode = async (input) => {
  try {
    const isValidUKPostcode = await axios.get(
      UK_POSTCODE_VALIDATOR.replace(`{postcode}`, input)
    );
    log(isValidUKPostcode.status);
    return true;
  } catch (error) {
    return false;
  }
};

// a function to check whether the user input is a valid location and whether it is in the UK
const locationCheck = async (input) => {
  const isValidPostcode = await postcodeValidator(input);
  const isPostcodeUK = await checkUKPostcode(input);
  log(isPostcodeUK);
  if (isValidPostcode && isPostcodeUK) {
    writeData(finalPostcode, POSTCODE_API_URL, "local");
    return;
  }

  // run it through the api
  try {
    const { data } = await axios.get(
      GEOCODING_API_URL.replace(`{address}`, input)
    );
    log(data);
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].display_name.includes("United Kingdom")) {
          const lat = data[i].lat;
          const long = data[i].lon;
          const coordData = { coords: { latitude: lat, longitude: long } };
          geoToPostcode(coordData);
          log("sik");
          return true;
        }
      }
    } else {
      errorMessage.innerHTML = errorText[0];
      return false;
    }
  } catch (error) {
    errorMessage.innerHTML = errorText[0];
  }
  errorMessage.innerHTML = errorText[0];
};

// ---------------------------------------------------------------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ---------------------------------------------------------------------------------------------------------------------------

// GEOLOCATION FUNCTIONS:
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
  container.innerHTML = "";
  regionDropDown.selectedIndex = 0;
  errorMessage.innerHTML = "";
  inputBox.value = "";
  geolocationButton.classList.remove("offButton");
  geolocationButton.classList.add("onButton");
  regionDropDown.classList.add("offButton");
  regionDropDown.classList.remove("onButton");

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

// ---------------------------------------------------------------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ---------------------------------------------------------------------------------------------------------------------------

// MAIN FUNCTIONS TO TALK TO API:
// a function to get data from the API
const getData = async (locationData, url) => {
  spinner.innerHTML = `<span class="loader"></span>`;

  const copiedUrl = url.slice();
  const splitUrl = copiedUrl.split("/");
  const replaceable = splitUrl[splitUrl.length - 1];

  try {
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
      const { data: d } = await axios.get(
        url.replace(replaceable, locationData)
      );

      localApiData = d.data[0];
      log(localApiData);
      return localApiData;
    }
  } catch (error) {
    log(error);
    errorMessage.innerHTML = errorText[1];
  }
};

// function to set a progress in a progress bar in css
const setProgress = (element, percent) => {
  element.style.width = percent + "%";
};

// display the obtained data for the user
const displayData = (data, elementId) => {
  spinner.innerHTML = ``;

  const containerChildren = container.querySelectorAll("div");

  if (containerChildren.length >= 1) {
    regionDropDown.disabled = true;
    compareButton.disabled = true;
    regionDropDown.classList.add("offButton");
    regionDropDown.classList.remove("onButton");
    compareButton.classList.add("offButton");
    compareButton.classList.remove("onButton");
  } else {
    regionDropDown.disabled = false;
    regionDropDown.classList.remove("offButton");
    regionDropDown.classList.add("onButton");
    compareButton.disabled = false;
    compareButton.classList.remove("offButton");
    compareButton.classList.add("onButton");
    clearButton.disabled = false;
    clearButton.classList.remove("offButton");
    clearButton.classList.add("onButton");
  }

  if (data) {
    const region = data.shortname;
    const stats = data.data[0];
    const fromDate = stats.from;
    const toDate = stats.to;
    const intensity = stats.intensity;
    const generationMix = stats.generationmix;

    // document.getElementById(container.id).innerHTML = "";

    updateDom(container.id, `div`, ``, elementId);

    updateDom(elementId, `h3`, `Region: ${region}`);
    updateDom(
      elementId,
      `h4`,
      `Time Period: ${timeStampToLocal(fromDate)} - ${timeStampToLocal(toDate)}`
    );
    updateDom(elementId, `h4`, `Carbon Intensity Data:`);
    updateDom(
      elementId,
      `p`,
      `Forecast: ${intensity.forecast} gCO<sub>2</sub>/kWh`
    );
    updateDom(elementId, `p`, `Index: ${intensity.index}`);

    updateDom(elementId, `h4`, `Electricity Generation Mix:`);

    generationMix.forEach((item) => {
      for (let key in item) {
        if (key === "fuel") {
          const capitalised =
            item[key].charAt(0).toUpperCase() + item[key].slice(1);

          updateDom(elementId, `h5`, `Fuel Type: `);
          updateDom(elementId, `p`, `${capitalised}`);
        } else {
          updateDom(elementId, `h5`, `Percentage of Mix: `);
          updateDom(elementId, `p`, `${item[key]}%`);
        }
      }
    });
  }
};

const updateDom = (targetId, tag, text, elementId = "") => {
  const element = document.createElement(tag);
  element.id = elementId;
  element.innerHTML = text;
  document.getElementById(targetId).appendChild(element);
};

// check and run the data function
const writeData = async (locationData, url, elementId) => {
  try {
    if (locationData) {
      const data = await getData(locationData, url);
      displayData(data, elementId);
      return;
    }
    return;
  } catch (error) {
    log(error);
    errorMessage.innerHTML = errorText[1];
  }
};

// ---------------------------------------------------------------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ---------------------------------------------------------------------------------------------------------------------------

const progressBar = document.getElementById("progress");

// Call the setProgress() function with a percentage value between 0 and 100 to update the progress bar
setProgress(progressBar, 20);
