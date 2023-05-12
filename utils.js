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

// create a chart using chart.js

const data = {
  labels: ["dassag", "massag", "vassag"],
  datasets: [
    {
      data: [300, 50, 100],
      backgroundColor: ["black", "blue", "green"],
      borderWidth: 2,
    },
  ],
};

const config = {
  type: "doughnut",
  data: data,
  plugins: [ChartDataLabels],
  options: {
    cutout: "75%", // the portion of the doughnut that is the cutout in the middle
    radius: 200,
    animation: true,
    aspectRatio: 1,
    responsive: true,
  },
};

const ctx = document.getElementById("myChart");

const myChart = new Chart(ctx, config);

const createChart = () => {};
