window.onload = function () {};

// document.getElementById("searchInput").addEventListener("blur", function () {
//   document.getElementById("searchDropdown").style.display = "none";
// });

// document.getElementById("searchInput").addEventListener("focus", function () {
//   if (document.getElementById("searchDropdown").children.length > 0) {
//     document.getElementById("searchDropdown").style.display = "block";
//   }
// });

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keyup", queryForData);
searchInput.addEventListener("keydown", function () {
  clearTimeout(typingTimer);
});

var typingTimer;
function queryForData(e) {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(function () {
    if (e.target.value !== "") {
      document.getElementById("clearSearch").style.display = "flex";
      // make request here
      // if result count is greater than 0, then show searchDropdown and set results
      // else, clear results and set display to none
      let weatherAPIURL =
        "http://localhost:4000/meta-weather/location/search/?query=";

      let weatherAPIURLWithQuery = weatherAPIURL + e.target.value;
      //console.log(weatherAPIURLWithQuery);

      fetch(weatherAPIURLWithQuery)
        .then((response) => response.json())
        .then(function (data) {
          //console.log(data);
          if (data.length > 0) {
            function removeAllChildNodes(parent) {
              while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
              }
            }
            const container = document.getElementById("searchDropdown");
            removeAllChildNodes(container);
            const slicedArray = data.slice(0, 5);
            for (var i in slicedArray) {
              //console.log(data[i]);
              // create new divs and then append to parent div
              var innerDiv = document.createElement("div");
              innerDiv.className = "searchResults";
              innerDiv.innerHTML = slicedArray[i].title;
              innerDiv.value = slicedArray[i].woeid;
              innerDiv.addEventListener("click", function handleClick(event) {
                //console.log(event.target.value);
                document.getElementById("searchInput").value =
                  event.target.innerHTML;
                setWeatherData(slicedArray[0].woeid);
                document.getElementById("searchDropdown").style.display =
                  "none";
              });
              document.getElementById("searchDropdown").appendChild(innerDiv);
            }
            document.getElementById("searchDropdown").style.display = "block";
          }
        });
    } else {
      document.getElementById("searchDropdown").style.display = "none";
      document.getElementById("resultsInnerHolder").style.display = "none";
      document.getElementById("clearSearch").style.display = "none";
    }
  }, 500);
}

const locationIcon = document.getElementById("locationIcon");

locationIcon.addEventListener("click", function handleClick(event) {
  // get position
  let currentPosition = navigator.geolocation.getCurrentPosition(function (
    position
  ) {
    let currentLat = position.coords.latitude.toFixed(2);
    let currentLon = position.coords.longitude.toFixed(2);

    let weatherAPIURL =
      "http://localhost:4000/meta-weather/location/search/?lattlong=";

    let weatherAPIURLWithLatLon = weatherAPIURL + currentLat + "," + currentLon;

    fetch(weatherAPIURLWithLatLon)
      .then((response) => response.json())
      .then(function (data) {
        if (data.length > 0) {
          document.getElementById("searchInput").value = data[0].title;
          document.getElementById("clearSearch").style.display = "flex";
          // call search and set weather to data[0].woeid
          setWeatherData(data[0].woeid);
        }
      });
  });
});

function setWeatherData(woeid) {
  //show results div
  document.getElementById("resultsInnerHolder").style.display = "flex";

  let weatherAPIURL = "http://localhost:4000/meta-weather/location/location/";
  let weatherAPIURLWithwoeid = weatherAPIURL + woeid + "/";

  fetch(weatherAPIURLWithwoeid)
    .then((response) => response.json())
    .then(function (data) {
      console.log(data);
      // if (data.length > 0) {
      //   document.getElementById("searchInput").value = data[0].title;
      //   // call search and set weather to data[0].woeid
      // }
    });
}

const clearSearchButton = document.getElementById("clearSearch");

clearSearchButton.addEventListener("click", function handleClick(event) {
  document.getElementById("searchDropdown").style.display = "none";
  document.getElementById("resultsInnerHolder").style.display = "none";
  document.getElementById("clearSearch").style.display = "none";
  document.getElementById("searchInput").value = "";
});
