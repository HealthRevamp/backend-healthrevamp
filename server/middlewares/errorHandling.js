function errorHandling(err, req, res, next) {
  let statusCode = 500;
  console.log(err);
  let message = "";
  switch (err.name) {
    case "SequelizeValidationError":
      const arrError = err.errors.map((el) => {
        return el.message;
      });
      statusCode = 400;
      message = arrError;
      break;
    case "UnaunthenticatedToken":
      statusCode = 401;
      message = "Error authentication";
      break;
    case "JsonWebTokenError":
      statusCode = 401;
      message = "Invalid token";
      break;
    case "errorLogin":
      statusCode = 401;
      message = "Invalid email/password";
      break;
    case "unauthorized":
      statusCode = 403;
      message = "Not Authorized";
      break;
    case "notFound":
      statusCode = 404;
      message = "Not Found";
      break;
    case "SequelizeUniqueConstraintError":
      statusCode = 409;
      message = "Email in use";
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
