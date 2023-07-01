function errorHandling(err, req, res, next) {
  let statusCode = 500;
  let message = "";
  switch (err.name) {
    case "SequelizeValidationError":
      statusCode = 400;
      message = "validation";
      break;
    case "unauthorized":
      statusCode = 403;
      message = "Not Authorized";
      break;
    case "notFound":
      statusCode = 404;
      message = "Not Found";
      break;
    default:
      message = "Internal Server Error";
      break;
  }
  res.status(statusCode).json({
    statusCode,
    message,
  });
}

module.exports = errorHandling;
