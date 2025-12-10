function logInfo(message, meta = {}) {
	console.log(`[INFO] ${message}`, meta);
}

function logError(message, meta = {}) {
	console.error(`[ERROR] ${message}`, meta);
}

module.exports = {
	logInfo,
	logError
};
