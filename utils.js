// to simplify console.log command
export const { log } = console;

// convert timestamp to a more readable date & time
export const timeStampToLocal = (dateString) => {
  return new Date(dateString).toLocaleString();
};
