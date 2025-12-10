const { Router } = require('express');
const { checkDbConnection } = require('../controllers/userController');

const router = Router();

router.get('/db-check', checkDbConnection);

module.exports = router;
