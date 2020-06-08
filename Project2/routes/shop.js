const path = require('path');

const express = require('express');

const produdctsController = require('../controllers/products');

const router = express.Router();

router.get('/', produdctsController.getProducts);

module.exports = router;
