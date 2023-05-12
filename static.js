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
  15: "England",
  16: "Scotland",
  17: "Wales",
  N: "National",
};

// set a variable with the API URL for POSTCODES
export const POSTCODE_API_URL = `https://api.carbonintensity.org.uk/regional/postcode/{postcode}`;

// set a regional API URL
export const REGIONAL_API_URL = `https://api.carbonintensity.org.uk/regional/regionid/{regionid}`;

// set a national API URL for intensity
export const NATIONAL_API_URL_INTENSITY = `https://api.carbonintensity.org.uk/intensity`;

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

// error texts
export const errorText = [
  "Please enter a valid UK area name or postcode.",
  "Something has gone wrong. Apologies for the inconvenience.",
];
