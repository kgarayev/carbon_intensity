export const regions = {
  1: "North Scotland",
  2: "South Scotland",
  3: "North West England",
  4: "North East England",
  5: "Yorkshire",
  6: "North Wales",
  7: "South Wales",
  8: "West Midlands",
  9: "East Midlands",
  10: "East England",
  11: "South West England",
  12: "South England",
  13: "London",
  14: "South East England",
  N: "National",
  15: "England",
  16: "Scotland",
  17: "Wales",
};

export const fuelIcons = {
  Biomass: `<img src="./icons/bio4.svg" alt="biomass" />`,
  Coal: `<img src="./icons/coal.svg" alt="coal">`,
  Imports: `<img src="./icons/import2.svg" alt="imports">`,
  Gas: `<img src="./icons/flame.svg" alt="gas" />`,
  Nuclear: `<img src="./icons/nuclear2.svg" alt="nuclear" />`,
  Other: `<img src="./icons/other2.svg" alt="other" />`,
  Hydro: `<img src="./icons/hydro.svg" alt="hydro" />`,
  Solar: `<img src="./icons/sun3.svg" alt="solar" />`,
  Wind: `<img src="./icons/wind.svg" alt="wind" />`,
};

export const intensityIcons = {
  "very high": ` <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 25 10 L 40 30 L 35 30 L 35 42 L 25 42 L 25 50 L 25 42 L 15 42 L 15 30 L 10 30 L 25 10 Z" fill="red"/>
                  </svg>

                  <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                      <path d="M 25 10 L 40 30 L 35 30 L 35 42 L 25 42 L 25 50 L 25 42 L 15 42 L 15 30 L 10 30 L 25 10 Z" fill="red"/>
                  </svg>`,

  high: `<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
            <path d="M 25 10 L 40 30 L 35 30 L 35 42 L 25 42 L 25 50 L 25 42 L 15 42 L 15 30 L 10 30 L 25 10 Z" fill="red"/>
        </svg>`,

  moderate: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="6" viewBox="0 0 30 6">
                <rect x="0" y="0" width="30" height="6" fill="#FFBF00"/>
              </svg>`,

  low: `<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
            <path d="M 25 40 L 40 20 L 35 20 L 35 10 L 15 10 L 15 20 L 10 20 L 25 40 Z" fill="green"/>
        </svg>`,

  "very low": `<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 25 40 L 40 20 L 35 20 L 35 10 L 15 10 L 15 20 L 10 20 L 25 40 Z" fill="green"/>
                </svg>

                <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 25 40 L 40 20 L 35 20 L 35 10 L 15 10 L 15 20 L 10 20 L 25 40 Z" fill="green"/>
                </svg>`,
};

// set a variable with the API URL for POSTCODES
export const POSTCODE_API_URL = `https://api.carbonintensity.org.uk/regional/postcode/{postcode}`;

// set a regional API URL
export const REGIONAL_API_URL = `https://api.carbonintensity.org.uk/regional/regionid/{regionid}`;

// set a national API URL for intensity
export const NATIONAL_API_URL_INTENSITY = `https://api.carbonintensity.org.uk/intensity`;

export const PLACEHOLDER = `check`;

// set a national API URL for generation mix
export const NATIONAL_API_URL_GENERATION = `https://api.carbonintensity.org.uk/generation`;

// set the geocoding API
export const GEOCODING_API_URL = `https://geocode.maps.co/search?q={address}`;

export const GEO_TO_POSTCODE_API_URL = `https://api.postcodes.io/postcodes?lon={longitude}&lat={latitude}`;

// validate UK postcode
export const UK_POSTCODE_VALIDATOR =
  "https://api.postcodes.io/postcodes/{postcode}";

// select the html element(s)
export const container = document.getElementById("container");

// geolocation button
export const geolocationButton = document.getElementById("geolocationButton");

// selecting a select tag in html
export const regionDropDown = document.getElementById("regionsList");

// selecting the compare button in html
export const compareButton = document.getElementById("compareButton");

// selecting clear button from html
export const clearButton = document.getElementById("clearButton");

// selecting error message element
export const errorMessage = document.getElementById("errorMessage");

// select html element input box
export const inputBox = document.getElementById("inputBox");

// select html element input box
export const spinner = document.getElementById("spinner");

// select sort dropdown
export const sortList = document.getElementById("sort");

// error texts
export const errorText = [
  "Please enter a valid area name or postcode in Britain.",
  "Something has gone wrong. Apologies for the inconvenience.",
  "Please select a valid UK region to compare.",
];
