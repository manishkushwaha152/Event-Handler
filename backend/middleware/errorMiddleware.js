const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
  });
};

module.exports = { errorHandler, notFound };
