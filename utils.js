// to simplify console.log command
export const { log } = console;

// convert timestamp to a more readable date & time
export const timeStampToLocal = (dateString) => {
  return new Date(dateString).toLocaleString();
};

// current time in ISO format
export const currentISO = () => {
  const now = new Date();
  const isoString = now.toISOString();
  log(isoString);
  return isoString;
};

// function to set a progress in a progress bar in css

export const setProgress = (percent) => {
  progressBar.style.width = percent + "%";
};
