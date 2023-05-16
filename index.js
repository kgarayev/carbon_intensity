import {
  regions,
  fuelIcons,
  intensityIcons,
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
  sortList,
} from "./static.js";

import { log, timeStampToLocal, sort, currentISO } from "./utils.js";

// final postcode in suitable format
let finalPostcode;

// user input
let userInput;

// variable for the local data from API
let localApiData;

// variable for the national data from API
let nationalApiData;

// state for the sorted data
let sortedMix = { options: {}, default: {} };

// define state
let state = {};

// ---------------------------------------------------------------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ---------------------------------------------------------------------------------------------------------------------------

// MAIN EVENT LISTENERS:
// get data from the user
document.addEventListener("input", (event) => {
  userInput = event.target.value.trim().toUpperCase();
  checkButton.disabled = false;

  inputBox.classList.remove("offButton");
  inputBox.classList.add("onButton");
});

checkButton.focus();

// submit the final user input and validate
document.getElementById("checkButton").addEventListener("click", (event) => {
  event.preventDefault();
  // errorMessage.innerHTML = "";
  container.innerHTML = "";
  regionDropDown.selectedIndex = 0;
  // inputBox.value = "";

  state = {};
  sortedMix.options = {};
  sortedMix.default = {};

  if (userInput) {
    locationCheck(userInput);
  } else {
    toastError(errorText[0]);
    // errorMessage.innerHTML = errorText[0];
    return;
  }
});

// click check button if Enter is pressed
inputBox.addEventListener("keydown", (event) => {
  if (event.key === `Enter`) {
    event.preventDefault();
    // errorMessage.innerHTML = "";
    container.innerHTML = "";
    regionDropDown.selectedIndex = 0;
    // inputBox.value = "";

    state = {};
    sortedMix.options = {};
    sortedMix.default = {};

    if (userInput) {
      locationCheck(userInput);
    } else {
      toastError(errorText[0]);
      // errorMessage.innerHTML = errorText[0];
      return;
    }
  }
});

// listen to compare button and call the API function
compareButton.addEventListener("click", (event) => {
  event.preventDefault();
  const selectedOption = regionDropDown.value;

  // state = {};
  // sortedMix.options = {};
  // sortedMix.default = {};

  // log(selectedOption);

  // errorMessage.innerHTML = ``;

  if (selectedOption == 0) {
    toastError(errorText[0]);
    // errorMessage.innerHTML = errorText[2];
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

  compareButton.classList.add("offButton");
  compareButton.classList.remove("onButton");

  sortList.value = "placeholder";
});

// event listener to listen to sort selection
sortList.addEventListener("change", (event) => {
  // sortedMix.options = {};
  // sortedMix.default = {};

  log(event.target.value);
  const sortOrder = event.target.value;

  container.innerHTML = ``;

  log(sortOrder);

  if (sortOrder == 0) {
    log("deault option selected");
    for (let key in state) {
      displayData(state[key], key, false);
    }
    log(sortedMix);
  } else {
    log("sort option selected");
    for (let key in sortedMix.options) {
      switch (sortOrder) {
        case "ascending":
          sortedMix.options[key].sort((a, b) => {
            return a.perc - b.perc;
          });
          break;
        case "descending":
          sortedMix.options[key].sort((a, b) => {
            return b.perc - a.perc;
          });
          break;
      }
    }

    for (let key in state) {
      displayData(state[key], key, true);
    }

    log(sortedMix);
  }
});

// clear the container
clearButton.addEventListener("click", (event) => {
  event.preventDefault();
  // errorMessage.innerHTML = "";
  container.innerHTML = "";
  inputBox.value = "";
  regionDropDown.selectedIndex = 0;
  checkButton.disabled = true;
  regionDropDown.disabled = true;
  compareButton.disabled = true;
  clearButton.disabled = true;
  geolocationButton.classList.add("offButton");
  geolocationButton.classList.remove("onButton");

  compareButton.classList.add("offButton");
  compareButton.classList.remove("onButton");
  clearButton.classList.add("offButton");
  clearButton.classList.remove("onButton");
  regionDropDown.classList.add("offButton");
  regionDropDown.classList.remove("onButton");

  sortList.value = "placeholder";

  state = {};

  sortedMix.options = {};
  sortedMix.default = {};

  sortList.disabled = true;
  sortList.classList.add("offButton");
  sortList.classList.remove("onButton");

  if (document.getElementById("local")) {
    document.getElementById("local").classList.remove("brutal");
  }

  if (document.getElementById("regional")) {
    document.getElementById("regional").classList.remove("brutal");
  }
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

        // errorMessage.innerHTML = "";
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
          return true;
        }
      }
    } else {
      toastError(errorText[0]);
      // errorMessage.innerHTML = errorText[0];
      return false;
    }
  } catch (error) {
    toastError(errorText[0]);
    // errorMessage.innerHTML = errorText[0];
  }
  toastError(errorText[0]);
  // errorMessage.innerHTML = errorText[0];
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

  try {
    const { data } = await axios.get(urlCopy);
    log(data);

    finalPostcode = data.result[0].postcode
      .trim()
      .replace(/\s+/g, "")
      .toUpperCase()
      .slice(0, -3);

    log(finalPostcode);
    writeData(finalPostcode, POSTCODE_API_URL, "local");
  } catch (error) {
    log(error);
    toastError(errorText[1]);
  }
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
  // errorMessage.innerHTML = "";
  inputBox.value = "";
  geolocationButton.classList.remove("offButton");
  geolocationButton.classList.add("onButton");
  regionDropDown.classList.add("offButton");
  regionDropDown.classList.remove("onButton");

  state = {};

  sortedMix.options = {};
  sortedMix.default = {};

  log(sortedMix);

  sortList.value = "placeholder";

  sortList.disabled = true;
  sortList.classList.add("offButton");
  sortList.classList.remove("onButton");

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
      // log(localApiData);
      return localApiData;
    }

    if (
      document.getElementById("local") &&
      !document.getElementById("regional")
    ) {
      document.getElementById("local").classList.remove("brutal");
      log("i removed local");
    }

    if (
      document.getElementById("regional") &&
      !document.getElementById("local")
    ) {
      document.getElementById("regional").classList.remove("brutal");
      log("i removed regional");
    }

    if (
      document.getElementById("regional") &&
      document.getElementById("local")
    ) {
      document.getElementById("regional").classList.remove("brutal");
      document.getElementById("local").classList.remove("brutal");
      log("i removed both");
    }
  } catch (error) {
    log(error);
    toastError(errorText[1]);
    // errorMessage.innerHTML = errorText[1];
  }
};

// display the obtained data for the user
const displayData = (data, elementId, toSort = false) => {
  clearToast();
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
    let generationMix = stats.generationmix;

    // document.getElementById(container.id).innerHTML = "";

    updateDom(container.id, `div`, ``, elementId);

    const brutalElement = document.getElementById(elementId);

    brutalElement.classList.add("brutal");

    updateDom(elementId, `h2`, `${region}`);
    updateDom(elementId, `h4`, `Time Period`);
    updateDom(elementId, `h5`, `From: ${timeStampToLocal(fromDate)}`);
    updateDom(elementId, `h5`, `To: ${timeStampToLocal(toDate)}`);
    updateDom(elementId, `h4`, `Carbon Intensity Data`);
    updateDom(
      elementId,
      `div`,
      `<div class="intensity" id="${intensity.index}-${region}">
          <h5>Forecast: ${intensity.forecast} gCO<sub>2</sub>/kWh</h5>
          <div class="intensity-index" style="display:flex">
            <h5>Index: ${intensity.index}</h5>
            <div class="intensity-icon" style="display:flex">${
              intensityIcons[intensity.index]
            }</div>
          </div>

      </div>`
    );
    // updateDom(elementId, `h5`, `Index: ${intensity.index}`);

    updateDom(elementId, `h4`, `Electricity Generation Mix`);

    if (toSort) {
      log(sortedMix);
      generationMix = sortedMix.options[elementId].slice();
      log(generationMix);
    } else {
      log(sortedMix);
      sortedMix.default[elementId] = generationMix.slice();
      sortedMix.options[elementId] = generationMix.slice();
      log(sortedMix);
    }

    generationMix.forEach((item) => {
      const capitalised =
        item["fuel"].charAt(0).toUpperCase() + item["fuel"].slice(1);

      // updateDom(elementId, `h5`, `Fuel Type: `);
      updateDom(elementId, `p`, `${capitalised}`);

      // updateDom(`wrapper`, `p`, `${item["perc"]}%`);

      updateDom(
        elementId,
        `div`,
        `<div class="progressDiv" id="progressDiv${capitalised}">
            <div class="fuel-icon">${fuelIcons[capitalised]}</div>

            <div class="progressBar">

              <div class="progress" id="${elementId}Progress${capitalised}">
              </div>
              <div class="percentage" id="${elementId}Percentage${capitalised}">
              </div>

            </div> 
         </div>`
      );

      document.getElementById(`progressDiv${capitalised}`).style.display =
        "flex";

      const progressBar = document.getElementById(
        `${elementId}Progress${capitalised}`
      );
      // log(progressBar);

      // // Call the setProgress() function with a percentage value between 0 and 100 to update the progress bar
      setProgress(progressBar, item["perc"]);

      const showPercentage = document.getElementById(
        `${elementId}Percentage${capitalised}`
      );
      showPercentage.innerHTML = `${item["perc"]}%`;
    });

    sortList.disabled = false;
    sortList.classList.remove("offButton");
    sortList.classList.add("onButton");
  }
};

const updateDom = (targetId, tag, text, elementId = "", className) => {
  const element = document.createElement(tag);
  element.id = elementId;
  // element.classList.add(className);
  element.innerHTML = text;
  document.getElementById(targetId).appendChild(element);
};

// check and run the data function
const writeData = async (locationData, url, elementId) => {
  try {
    if (locationData) {
      const data = await getData(locationData, url);
      // log(data);
      state[elementId] = Object.assign({}, data);
      log(state);
      displayData(data, elementId);
      return;
    }
    return;
  } catch (error) {
    log(error);
    toastError(errorText[1]);
    // errorMessage.innerHTML = errorText[1];
  }
};

// ---------------------------------------------------------------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ---------------------------------------------------------------------------------------------------------------------------

// function to set a progress in a progress bar in css
const setProgress = (element, percent) => {
  element.style.width = 1 + percent + "%";
};

// toasting

const toast = document.getElementById("toast");
const closeIcon = document.getElementById("toastClose");
const progress = document.getElementById("progress");
const toastText = document.getElementById("toastText");
const toastWrapper = document.getElementById("toastDiv");

let timer1;
let timer2;

const toastError = (message) => {
  log(message);
  toastWrapper.style.height = "9rem";

  toast.classList.add("active");
  progress.classList.add("active");
  toastText.innerHTML = message;

  timer1 = setTimeout(() => {
    toast.classList.remove("active");
    toastWrapper.style.height = "0.5rem";
  }, 5000);

  timer2 = setTimeout(() => {
    progress.classList.remove("active");
  }, 5300);
};

closeIcon.addEventListener("click", () => {
  toast.classList.remove("active");
  progress.classList.remove("active");
  toastWrapper.style.height = "0.5rem";

  clearTimeout(timer1);
  clearTimeout(timer2);
});

const clearToast = () => {
  toast.classList.remove("active");
  progress.classList.remove("active");
  toastWrapper.style.height = "0.5rem";

  clearTimeout(timer1);
  clearTimeout(timer2);
};
