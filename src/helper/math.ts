const modulo = (a, b) => {
  const r = a % b;
  return r * b < 0 ? r + b : r;
};

const toRadians = (angleInRadians) => {
  return angleInRadians * 180 / Math.PI;
};

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export {
  clamp,
  modulo,
  toRadians
}
