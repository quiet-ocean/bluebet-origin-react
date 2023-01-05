// Cut decimal points without rounding them
const cutDecimalPoints = num => {
  return num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
};

export default cutDecimalPoints;
