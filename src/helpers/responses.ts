/**
 * @param {*} cookie object {name, value}
 * Send a response with 200 status code and set cookie with [name=value] in the client
 */
export const successResponseWithCookie = (res, msg, cookie) => res.status(200)
	.cookie(cookie.name, cookie.value, {
		httpOnly: true,
	}).json({
		success: 1,
		message: msg,
	});

/**
 * @param {*} cookie Name of the cookie to clear
 * Send a response with 200 status code and clear the cookie with [name:name] in the client
 */
export const successResponseWithCookieClear = (res, msg, cookie) => res.status(200)
	.clearCookie(cookie.name).json({
		success: 1,
		message: msg,
	});

/**
 * Send a response with 200 status code and a message
 */
export const successResponseWithMessage = (res, msg) => res.status(200).json({
	success: 1,
	message: msg,
});

/**
 * Send a response with 400 status code and a message
 */
export const failureResponseWithMessage = (res, msg) => res.status(400).json({
	success: 0,
	message: `${msg} :(`,
});

/**
 * Send a response with 400 status code and a message
 */
export const badRequestResponseWithMessage = (res, msg) => res.status(400).json({
	success: 0,
	message: msg,
});

/**
 * @param {*} data The data object to send to the client
 * Send a response with 200 status code and some data
 */
export const successResponseWithData = (res, data) => res.status(200).json({
	success: 1,
	data,
});

/**
 * Send a response with the given status code and the list of errors
 */
export const errorResponse = (res, error = 'something went wrong!', status = 500) => res.status(status).json({
	success: 0,
	errors: [error],
});

/**
 * Send a response with the given status code and the list of errors
 */
export const errorsResponse = (res, errors = ['something went wrong!'], status = 500) => res.status(status).json({
	success: 0,
	errors,
});

/**
 * Send a response with the 401 status code for unauthenticated users
 */
export const unauthenticatedResponse = (res, error = 'Unauthenticated for this action') => errorResponse(res, error, 401);

/**
 * Send a response with the 403 status code for unauthorized users
 */
export const unauthorizedResponse = (res, error = 'Unauthorized for this action') => errorResponse(res, error, 403);

/**
 * Send a response with the 404 status code when the resource is not found
 */
export const notFoundResponse = (res, error = 'Resource not found') => errorResponse(res, error, 404);

/**
 * Send a response with the 401 status code when token is invalid
 */
export const tokenErrorResponse = (res, error = 'Token is either malformed or expired') => unauthenticatedResponse(res, error);

/**
 * Send a response with the 401 status code when token is invalid
 * errors is the validationResult from express-validator
 */
export const validationErrorResponse = (res, errors) => res.status(422).json({
	success: 0,
	errors: errors.formatWith(({ msg }) => msg).array(),
});

/**
 * Send a response with the 422 status code when there are errors with mongoose
 */
export const mongooseValidationErrorResponse = (res, err) => res.status(422).json({
	success: 0,
	err,
});

/**
 * Send a response with a redirect to the provided url
 */
export const redirectToURL = (res, url) => res.redirect(url);

/**
 * Send a response with the 501 status code when the endpoint is not implemented
 */
export const notImplementedResponse = (res) => res.status(501).json({
	success: 0,
	msg: 'Endpoint not implemented! Maybe request people at SDSLabs? https://chat.sdslabs.co/',
});
