const calculatePrice = (duration) => {
  switch (duration) {
    case 1:
      return 100_000;
    case 6:
      return 200_000;
    case 12:
      return 300_000;
    default:
      return 100_1000;
  }
};

module.exports = calculatePrice
