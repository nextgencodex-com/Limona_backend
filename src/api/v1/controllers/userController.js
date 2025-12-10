const userService = require('../../../services/userService');

async function checkDbConnection(req, res, next) {
	try {
		const result = await userService.pingDatabase();
		res.json({ status: 'ok', db: result });
	} catch (err) {
		next(err);
	}
}

module.exports = {
	checkDbConnection
};
