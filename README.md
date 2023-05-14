# UK Carbon Intensity and Electricity Generation Mix Bot :bulb:

##

##

## Overview

UK Carbon Intensity and Electricity Generation Mix Bot is a frontend-only webpage created using Vanilla Javascript. It gets location data from the user and displays the information about the carbon intensity and generation mix of the local electricity network for the current 30 minutes.

##

## Functionality

The webpage allows users to input their location using a postcode, area name or current location via geolocation API. Event listeners and various functions are used to validate the input, including regex, and two APIs to verify postcodes and area names.

If the input is valid, the National Grid API is used to obtain data via Axios. The webpage also offers additional functionalities, including the ability to compare local data with regional data, sort the generation mix data, and reset everything on the screen using the "Clear All" button.

##

## Author

The webpage was created by Kanan Garayev, who used this project as an opportunity to gain in-depth knowledge of Javascript, understand its fundamentals, and push himself beyond his previous programming experience.

##

## Styling

The webpage is fully responsive and works on all devices. The CSS was built from scratch, without using any external libraries or frameworks.

##

## Link

### :star: [UK Carbon Intensity and Electricity Generation Mix Bot](https://gb-carbon-intensity.netlify.app/) :star:

##

#### :sparkles: Main features:

- Full Javascript functionality and control
- Use of regex and Joi to validate input
- Use of multiple APIs to validate input and fetch data for the user on the screen
- Additional functionalities like sorting and comparing
- Use of Object-Oriented and Functional Programming techniques
- Effective DOM manipulation
- Fully responsive on all devices
- Use of CSS from scratch without using any external frameworks (like Bootstrap)

#### :zap: Opportunities for improvement:

- Better consistency in terms of a programming paradigm (either OOP or Functional)
- Better planning to avoid adding additional features in a rush that can create some messy code inside some functions
- Code readability inside functions
- Opportunity to remove some repeating code and optimize (both JS and CSS)
- Some of the DOM references and manipulation could be more optimized and efficient
- Use of CSS pre-processors (such as SASS) to speed up production
- Use of JS animation (Greensock)
- A feature to add a dark mode (using a toggle)

Overall, the UK Carbon Intensity and Electricity Generation Mix Bot is a well-executed project that showcases the author's knowledge of Vanilla Javascript, and provides an effective and responsive user experience. The webpage's additional functionalities make it stand out, and the opportunities for improvement provide a roadmap for further development.
