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
