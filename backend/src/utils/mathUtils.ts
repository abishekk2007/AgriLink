export function roundToDecimal(num: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return roundToDecimal(sum / values.length);
}

export function calculateMin(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.min(...values);
}

export function calculateMax(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.max(...values);
}

export function calculatePercentageChange(first: number, latest: number): number {
  if (first === 0) return 0;
  return roundToDecimal(((latest - first) / first) * 100);
}

export function calculateStdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = calculateAverage(values);
  const squareDiffs = values.map((value) => Math.pow(value - avg, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / (values.length - 1);
  return roundToDecimal(Math.sqrt(avgSquareDiff));
}

export function calculatePercentileRank(value: number, series: number[]): number {
  if (series.length === 0) return 50;
  const countBelow = series.filter((v) => v < value).length;
  const countEqual = series.filter((v) => v === value).length;
  // Standard midpoint percentile rank
  const rank = ((countBelow + 0.5 * countEqual) / series.length) * 100;
  return roundToDecimal(rank);
}

export function calculateLinearSlope(yValues: number[]): number {
  const n = yValues.length;
  if (n < 2) return 0;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += yValues[i];
    sumXY += i * yValues[i];
    sumXX += i * i;
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  return roundToDecimal(slope, 4);
}
