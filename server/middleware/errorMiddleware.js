// Central error handler: controllers just call next(err).
module.exports = (err, req, res, next) => {
  let status = 500;
  let message = err.message;

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  } else if (err.code === 11000) {
    status = 409;
    message = 'Email already registered';
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID';
  }

  if (status === 500) {
    console.error(err);
    message = 'Server error'; // don't leak internals
  }
  res.status(status).json({ message });
};
