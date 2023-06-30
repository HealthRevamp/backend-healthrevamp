const udpateDate = (date, addDate) => {
  return new Date(date.setDate(date.getDate() + parseInt(addDate)));
};

module.exports = udpateDate;
