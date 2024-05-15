function calculateEqualIntervals(data) {
  // Use d3.min and d3.max to find the minimum and maximum values
  const min = d3.min(data);
  const max = d3.max(data);

  // Calculate the interval size
  const intervalSize = (max - min) / 3;

  // Determine the breakpoints
  const breakpoint1 = min + intervalSize;
  const breakpoint2 = min + 2 * intervalSize;

  // Return the breakpoints
  return [breakpoint1, breakpoint2];
}

// Should be the same as equal intervals above
function quantizeIntervals(data) {
  quantizeScale = d3
    .scaleQuantize()
    .domain(d3.extent(data)) // pass only the extreme values to a scaleQuantize’s domain
    .range(["low", "med", "high"]);

  return quantizeScale.thresholds();
}

function quantileIntervals(data) {
  quantileScale = d3.scaleQuantile().domain(data).range(["low", "med", "high"]);

  return quantileScale.quantiles();
}

function clusterIntervals(data) {
  clusterScale = d3.scaleCluster().domain(data).range(["low", "med", "high"]);

  return clusterScale.clusters();
}
