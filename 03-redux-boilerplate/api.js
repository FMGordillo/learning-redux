const fetchData = (url, callback) =>
  axios
    .get(url)
    .then(callback)
    .catch(err => console.log(`Error fetching: ${err}`));

window.fetchData = fetchData;
