/**
 * Standardised success response
 */
function success(res, data = {}, message = 'OK', statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, ...data });
}

/**
 * Standardised error response (used in errorHandler too)
 */
function error(res, message = 'Something went wrong', statusCode = 500, errors = undefined) {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
}

module.exports = { success, error };
