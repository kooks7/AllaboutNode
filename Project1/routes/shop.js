const path = require('path');
const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
  // windws 와 Lunux 에서 경로 설정이 다르므로 경로에 /나 \를 사용하지 않는다.
  const products = adminData.products;
  console.log('11111', adminData.products);
  res.render('shop', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productCss: true
  });
});

module.exports = router;
