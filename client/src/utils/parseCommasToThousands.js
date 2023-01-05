// Parse commas into thousands
const parseCommasToThousands = value => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default parseCommasToThousands;
