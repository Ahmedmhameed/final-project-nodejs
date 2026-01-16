const returnJson = (res, statusCode, status, message, data) => {
  res.status(statusCode).json({
    resStatsu: {
      status,
      message,
    },
    data,
  });
};

module.exports = { returnJson };
