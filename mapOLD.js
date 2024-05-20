let field1 = "Current_Asthma_%";
//   const field1 = "COPD_%";
let field2 = "Current_Smoking_%";
let intervals = "equal";

const colors = {
  lowLow: "#d3d3d3",
  lowMed: "#82caca",
  lowHigh: "#82caca",
  medLow: "#d28ac4",
  medMed: "#736f9c",
  medHigh: "#366792",
  highLow: "#d606ad",
  highMed: "#7a1989",
  highHigh: "#451d80",
};

// Load data
let data;
async function loadData() {
  const csvUrl =
    // "https://raw.githubusercontent.com/kelsey-n/data/main/JFA/PLACES_data_processed%20(1)%20simplified.csv";
    "https://raw.githubusercontent.com/kelsey-n/data/main/JFA/places_income_merged.csv";

  const data = await d3.csv(csvUrl, d3.autoType);

  const columns = Object.keys(data[0]).filter(
    (d, i) => (i >= 3 && i < 28) || (i > 29 && i < 33)
  );

  const select1 = document.getElementById("field1-selector");
  const select2 = document.getElementById("field2-selector");

  columns.forEach((column) => {
    [select1, select2].forEach((select) => {
      const option = document.createElement("option");
      option.value = column;
      option.textContent = column;
      select.appendChild(option);
    });
  });

  return data;
}

mapboxgl.accessToken =
  // "pk.eyJ1Ijoia25hbmFuIiwiYSI6ImNrbDlsMXNmNjI3MnEyb25yYjNremFwYXQifQ.l6loLOR-pOL_U2kzWBSQNQ";
  "pk.eyJ1Ijoia25hbmFuIiwiYSI6ImNsdnpmNDY3NDBpNGUycXBibTlscnp3MG0ifQ.ghqVHa8_6kBGFUBAmhuVcA";
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9, // starting zoom
  style: "mapbox://styles/knanan/clw6km9p0002301ox0dtr3rme", // Replace with your style URL
});

function updateMapLayer(
  field1,
  field2,
  map,
  data,
  layerConfig,
  intervals = "equal"
) {
  // Function to update map layers based on selected fields
  // This would involve fetching data, calculating intervals, and updating the layer style
  console.log("Update map layers using:", field1, field2);

  let field1Breakpoints, field2Breakpoints;

  if (intervals === "quantize") {
    field1Breakpoints = quantizeIntervals(data.map((d) => d[field1]));
    field2Breakpoints = quantizeIntervals(data.map((d) => d[field2]));
  } else if (intervals === "quantile") {
    field1Breakpoints = quantileIntervals(data.map((d) => d[field1]));
    field2Breakpoints = quantileIntervals(data.map((d) => d[field2]));
  } else if (intervals === "cluster") {
    field1Breakpoints = clusterIntervals(data.map((d) => d[field1]));
    field2Breakpoints = clusterIntervals(data.map((d) => d[field2]));
  } else {
    field1Breakpoints = calculateEqualIntervals(data.map((d) => d[field1]));
    field2Breakpoints = calculateEqualIntervals(data.map((d) => d[field2]));
  }

  console.log(field1Breakpoints, field2Breakpoints);

  document.getElementById(
    "field1-breakpoints"
  ).innerHTML = `[${field1Breakpoints.map((d) => d3.format(".3n")(d))}]`;
  document.getElementById(
    "field2-breakpoints"
  ).innerHTML = `[${field2Breakpoints.map((d) => d3.format(".3n")(d))}]`;

  const [low1, med1] = field1Breakpoints;
  const [low2, med2] = field2Breakpoints;

  if (map.getLayer("custom-layer")) {
    // Remove the layer
    map.removeLayer("custom-layer");
    map.removeSource("custom-layer");
  }
  if (map.getLayer("highlight-census-tract")) {
    // Remove the layer
    map.removeLayer("highlight-census-tract");
    map.removeSource("highlight-feature");
  }
  // if (map.getSource("joined_data_2-7nub1l")) {
  //   // Remove the source
  //   map.removeSource("joined_data_2-7nub1l");
  // }

  map.addLayer({
    id: "custom-layer",
    //   type: "fill", // or 'line', 'circle', depending on your data type
    //   source: {
    //     type: "vector",
    //     url: "mapbox://knanan.b3847kbo", // Replace with your tileset ID
    //   },
    //   "source-layer": "joined_data_2-7nub1l", // Replace with the actual name of the layer in your tileset
    paint: {
      //"#d3d3d3",
      "fill-color": [
        "case",
        ["==", ["get", field1], null], // Set color to white if missing values
        "#ffffff",
        ["==", ["get", field2], null],
        "#ffffff",
        ["all", ["<=", ["get", field1], low1], ["<=", ["get", field2], low2]],
        colors.lowLow,
        [
          "all",
          ["<=", ["get", field1], low1],
          ["all", [">", ["get", field2], low2], ["<=", ["get", field2], med2]],
        ],
        colors.lowMed,
        ["all", ["<=", ["get", field1], low1], [">", ["get", field2], med2]],
        colors.lowHigh,
        [
          "all",
          ["all", [">", ["get", field1], low1], ["<=", ["get", field1], med1]],
          ["<=", ["get", field2], low2],
        ],
        colors.medLow,
        [
          "all",
          ["all", [">", ["get", field1], low1], ["<=", ["get", field1], med1]],
          ["all", [">", ["get", field2], low2], ["<=", ["get", field2], med2]],
        ],
        colors.medMed,
        [
          "all",
          ["all", [">", ["get", field1], low1], ["<=", ["get", field1], med1]],
          [">", ["get", field2], med2],
        ],
        colors.medHigh,
        ["all", [">", ["get", field1], med1], ["<=", ["get", field2], low2]],
        colors.highLow,
        [
          "all",
          [">", ["get", field1], med1],
          ["all", [">", ["get", field2], low2], ["<=", ["get", field2], med2]],
        ],
        colors.highMed,
        ["all", [">", ["get", field1], med1], [">", ["get", field2], med2]],
        colors.highHigh,
        "#ffffff", // Default color if none of the conditions are met
      ],
      "fill-outline-color": "#A9A9A9",
    },
    ...layerConfig,
  });

  // add an empty data source, which we will use to highlight the CD that the user is hovering over
  map.addSource("highlight-feature", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  });
  // add a layer for the highlighted tract
  map.addLayer({
    id: "highlight-census-tract",
    type: "line",
    source: "highlight-feature",
    paint: {
      "line-width": 2,
      "line-opacity": 0.9,
      "line-color": "black",
    },
  });
}

map.on("load", async function () {
  try {
    // Await the loadData function and destructure the returned object
    //   const { field1Breakpoints, field2Breakpoints } = await loadData();
    const data = await loadData();

    console.log(data);

    const layerId = "custom-layer";
    // const sourceId = 'existing-source'; // ID of the already added source

    const layerConfig = {
      type: "fill",
      source: {
        type: "vector",
        url: "mapbox://knanan.a2h8ys5c", // Replace with your tileset ID
      },
      // "source-layer": "joined_data_2-7nub1l", // Replace with the actual name of the layer in your tileset
      "source-layer": "places_income_data-1y332n", // Replace with the actual name of the layer in your tileset
    };

    updateMapLayer(field1, field2, map, data, layerConfig, intervals);

    // // add an empty data source, which we will use to highlight the CD that the user is hovering over
    // map.addSource("highlight-feature", {
    //   type: "geojson",
    //   data: {
    //     type: "FeatureCollection",
    //     features: [],
    //   },
    // });
    // // add a layer for the highlighted tract
    // map.addLayer({
    //   id: "highlight-census-tract",
    //   type: "line",
    //   source: "highlight-feature",
    //   paint: {
    //     "line-width": 2,
    //     "line-opacity": 0.9,
    //     "line-color": "black",
    //   },
    // });

    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.on("mousemove", "custom-layer", (e) => {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = "pointer";

      // console.log(e.features[0]);

      // Content for popup
      const description = `${e.features[0].properties.CountyName} County,
            ${e.features[0].properties.StateDesc}<br>
            ${e.features[0].properties.NAMELSAD}<br>
            ${field1}: ${e.features[0].properties[field1]}<br>
            ${field2}: ${e.features[0].properties[field2]}<br>
            `;

      popup.setLngLat(e.lngLat).setHTML(description).addTo(map);

      // set this tract's polygon feature as the data for the highlight source
      map.getSource("highlight-feature").setData(e.features[0].geometry);
    });

    map.on("mouseleave", "custom-layer", (e) => {
      // remove the Popup, reset cursor, remove data from highlight layer
      popup.remove();
      map.getCanvas().style.cursor = "";
      map.getSource("highlight-feature").setData({
        type: "FeatureCollection",
        features: [],
      });
    });

    document
      .getElementById("field1-selector")
      .addEventListener("change", function () {
        field1 = this.value;
        updateMapLayer(
          // this.value,
          // document.getElementById("field2-selector").value,
          field1,
          field2,
          map,
          data,
          layerConfig,
          intervals
        );
      });

    document
      .getElementById("field2-selector")
      .addEventListener("change", function () {
        field2 = this.value;
        updateMapLayer(
          // document.getElementById("field1-selector").value,
          // this.value,
          field1,
          field2,
          map,
          data,
          layerConfig,
          intervals
        );
      });

    // Handle change in scale dropdown
    document
      .getElementById("scale-selector")
      .addEventListener("change", function () {
        intervals = this.value;
        updateMapLayer(field1, field2, map, data, layerConfig, intervals);
      });
  } catch (error) {
    console.error("Error loading data or adding layer:", error);
  }
});
