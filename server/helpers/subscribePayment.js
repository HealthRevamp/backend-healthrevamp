const calculatePrice = (duration) => {
  switch (duration) {
    case 30:
      return 100_000;
    case 180:
      return 200_000;
    case 360:
      return 300_000;
    default:
      return 100_000;
  }
};

module.exports = calculatePrice
