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
