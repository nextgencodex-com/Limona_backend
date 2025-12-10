const { logError } = require('./logger');

function notFound(req, res, next) {
	const error = new Error('Not Found');
	error.status = 404;
	next(error);
}

// Express error-handling middleware signature (err, req, res, next)
function errorHandler(err, req, res, next) {
	logError(err.message, { stack: err.stack });
	const status = err.status || 500;
	res.status(status).json({
		status: 'error',
		message: status === 500 ? 'Internal Server Error' : err.message
	});
}

module.exports = {
	notFound,
	errorHandler
};
