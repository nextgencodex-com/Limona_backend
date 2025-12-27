const express = require('express');
const router = express.Router();
const debugController = require('../controllers/debugController');

router.get('/db', debugController.dbInfo);

module.exports = router;
