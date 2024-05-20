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
  // https://docs.google.com/spreadsheets/d/e/2PACX-1vSuE27clKPtpM6gv3Me6KqxhPmnWqh9wjR9RLfM3nvX0RcO1zsUV7P7-p41MucJtbjej1oPJUnHuIBY/pubhtml
  // https://docs.google.com/spreadsheets/d/e/2PACX-1vSuE27clKPtpM6gv3Me6KqxhPmnWqh9wjR9RLfM3nvX0RcO1zsUV7P7-p41MucJtbjej1oPJUnHuIBY/pub?output=csv
  const csvUrl =
    // "https://raw.githubusercontent.com/kelsey-n/data/main/JFA/PLACES_data_processed%20(1)%20simplified.csv";
    // "https://raw.githubusercontent.com/kelsey-n/data/main/JFA/places_income_merged.csv";
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSuE27clKPtpM6gv3Me6KqxhPmnWqh9wjR9RLfM3nvX0RcO1zsUV7P7-p41MucJtbjej1oPJUnHuIBY/pub?output=csv";

  const data = await d3.csv(csvUrl, d3.autoType);

  // Create a Map object to easily look up values by id
  var dataMap = new Map();
  data.forEach(function (row) {
    // Check for null FIPS and handle it
    var fipsValue = row.FIPS;
    var paddedFIPS =
      fipsValue !== null && fipsValue !== undefined
        ? // Forward-fill the FIPS field with leading zeroes
          fipsValue.toString().padStart(11, "0")
        : null;
    if (paddedFIPS) {
      dataMap.set(paddedFIPS, row);
    }
  });

  //   console.log(dataMap);

  //   const columns = Object.keys(data[0]).filter(
  //     (d, i) => (i >= 3 && i < 28) || (i > 29 && i < 33)
  //   );

  const columns = [
    "COPD_%",
    "Current_Asthma_%",
    "Current_Smoking_%",
    "HHS_Total_#",
    "HHS_Median_Income_#",
    "HHS_Mean_Income_#",
    "HHS_<10000_%",
    "HHS_10000_14999_%",
    "HHS_15000_24999_%",
    "HHS_25000_34999_%",
    "HHS_35000_49999_%",
    "HHS_50000_74999_%",
    "HHS_75000_99999_%",
    "HHS_100000_149999_%",
    "HHS_150000_199999_%",
    "HHS_200000+_%",
    "HHS_Total_#_MOE",
    "HHS_Median_Income_#_MOE",
    "HHS_Mean_Income_#_MOE",
    "HHS_<10000_%_MOE",
    "HHS_10000_14999_%_MOE",
    "HHS_15000_24999_%_MOE",
    "HHS_25000_34999_%_MOE",
    "HHS_35000_49999_%_MOE",
    "HHS_50000_74999_%_MOE",
    "HHS_75000_99999_%_MOE",
    "HHS_100000_149999_%_MOE",
    "HHS_150000_199999_%_MOE",
    "HHS_200000+_%_MOE",
    "E_TOTPOP",
    "E_HU",
    "E_HH",
    "E_POV150",
    "E_UNEMP",
    "E_HBURD",
    "E_NOHSDP",
    "E_UNINSUR",
    "E_AGE65",
    "E_AGE17",
    "E_DISABL",
    "E_SNGPNT",
    "E_LIMENG",
    "E_MINRTY",
    "E_MUNIT",
    "E_MOBILE",
    "E_CROWD",
    "E_NOVEH",
    "E_GROUPQ",
    "EP_POV150",
    "EP_UNEMP",
    "EP_HBURD",
    "EP_NOHSDP",
    "EP_UNINSUR",
    "EP_AGE65",
    "EP_AGE17",
    "EP_DISABL",
    "EP_SNGPNT",
    "EP_LIMENG",
    "EP_MINRTY",
    "EP_MUNIT",
    "EP_MOBILE",
    "EP_CROWD",
    "EP_NOVEH",
    "EP_GROUPQ",
    "SPL_THEME1",
    "SPL_THEME2",
    "SPL_THEME3",
    "SPL_THEME4",
    "SPL_THEMES",
    "E_DAYPOP",
    "E_NOINT",
    "E_AFAM",
    "E_HISP",
    "E_ASIAN",
    "E_AIAN",
    "E_NHPI",
    "E_TWOMORE",
    "E_OTHERRACE",
    "EP_NOINT",
    "EP_AFAM",
    "EP_HISP",
    "EP_ASIAN",
    "EP_AIAN",
    "EP_NHPI",
    "EP_TWOMORE",
    "EP_OTHERRACE",
  ];

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

  return dataMap;
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
  let valuesArray = Array.from(data.values());

  if (intervals === "quantize") {
    field1Breakpoints = quantizeIntervals(valuesArray.map((d) => d[field1]));
    field2Breakpoints = quantizeIntervals(valuesArray.map((d) => d[field2]));
  } else if (intervals === "quantile") {
    field1Breakpoints = quantileIntervals(valuesArray.map((d) => d[field1]));
    field2Breakpoints = quantileIntervals(valuesArray.map((d) => d[field2]));
  } else if (intervals === "cluster") {
    field1Breakpoints = clusterIntervals(valuesArray.map((d) => d[field1]));
    field2Breakpoints = clusterIntervals(valuesArray.map((d) => d[field2]));
  } else {
    field1Breakpoints = calculateEqualIntervals(
      valuesArray.map((d) => d[field1])
    );
    field2Breakpoints = calculateEqualIntervals(
      valuesArray.map((d) => d[field2])
    );
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

  // Calculate colors based on the CSV data fields
  var colorExpression = [
    "match",
    ["get", "GEOID"], // Ensure this matches the property in your GeoJSON
  ];

  data.forEach(function (row, key) {
    var field1Val = row[field1]; // Convert to number if necessary
    var field2Val = row[field2]; // Convert to number if necessary

    var color;
    if (field1Val === null || field2Val === null) {
      color = "#ffffff";
    } else if (field1Val <= low1 && field2Val <= low2) {
      color = colors.lowLow;
    } else if (field1Val <= low1 && field2Val > low2 && field2Val <= med2) {
      color = colors.lowMed;
    } else if (field1Val <= low1 && field2Val > med2) {
      color = colors.lowHigh;
    } else if (field1Val > low1 && field1Val <= med1 && field2Val <= low2) {
      color = colors.medLow;
    } else if (
      field1Val > low1 &&
      field1Val <= med1 &&
      field2Val > low2 &&
      field2Val <= med2
    ) {
      color = colors.medMed;
    } else if (field1Val > low1 && field1Val <= med1 && field2Val > med2) {
      color = colors.medHigh;
    } else if (field1Val > med1 && field2Val <= low2) {
      color = colors.highLow;
    } else if (field1Val > med1 && field2Val > low2 && field2Val <= med2) {
      color = colors.highMed;
    } else if (field1Val > med1 && field2Val > med2) {
      color = colors.highHigh;
    } else {
      // Add more conditions as needed
      color = "#d3d3d3"; // Default color
    }

    colorExpression.push(key, color);
  });

  colorExpression.push("#d3d3d3"); // Default color if no match is found

  map.addLayer({
    id: "custom-layer",
    //   type: "fill", // or 'line', 'circle', depending on your data type
    //   source: {
    //     type: "vector",
    //     url: "mapbox://knanan.b3847kbo", // Replace with your tileset ID
    //   },
    //   "source-layer": "joined_data_2-7nub1l", // Replace with the actual name of the layer in your tileset
    paint: {
      "fill-color": colorExpression,
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

    const layerId = "custom-layer";
    // const sourceId = 'existing-source'; // ID of the already added source

    const layerConfig = {
      type: "fill",
      source: {
        type: "vector",
        url: "mapbox://knanan.b3847kbo", // Replace with your tileset ID
        // url: "mapbox://knanan.a2h8ys5c", // Replace with your tileset ID
      },
      "source-layer": "joined_data_2-7nub1l", // Replace with the actual name of the layer in your tileset
      //   "source-layer": "places_income_data-1y332n", // Replace with the actual name of the layer in your tileset
    };

    updateMapLayer(field1, field2, map, data, layerConfig, intervals);

    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.on("mousemove", "custom-layer", (e) => {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = "pointer";

      //   console.log(e.features[0]);
      //   console.log(data.get(e.features[0].properties.GEOID));
      //   console.log(data);
      const hoveredData = data.get(e.features[0].properties.GEOID);

      // Content for popup
      const description = `${e.features[0].properties.CountyName} County,
            ${e.features[0].properties.StateDesc}<br>
            ${e.features[0].properties.NAMELSAD}<br>
            ${field1}: ${hoveredData[field1]}<br>
            ${field2}: ${hoveredData[field2]}<br>
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
