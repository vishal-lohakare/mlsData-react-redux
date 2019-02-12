const fs = require('fs');

// TODO: Change request method to get data from server api
const request = (url) => {
  return JSON.parse(fs.readFileSync(url, "utf8"));
}

/**
 * Method to make request to server
 */
function getDefs() {
  let defs = [];
  defs.push(request(`${__dirname}/apache-spark-functions.json`));
  return defs;
}

module.exports = getDefs();