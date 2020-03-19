const path = require('path');

const express = require('express');
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
  '/add-product',
  [
    body('title', 'Title에 최소한 5글자 이상 넣어주세요')
      .isLength({ min: 3 })
      .isString()
      .trim(),
    body('price', '숫자만 입력해주세요').isFloat(),
    body('description', '설명에 최소 5글자 이상을 작성해 주세요')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth,
  adminController.postAddProduct
);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
  '/edit-product',
  isAuth,
  [
    body('title', 'Title에 최소한 5글자 이상 넣어주세요')
      .isLength({ min: 3 })
      .isString()
      .trim(),
    body('price', '숫자만 입력해주세요').isFloat(),
    body('description', '설명에 최소 5글자 이상을 작성해 주세요')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  adminController.postEditProduct
);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
