var express = require('express');
var router = express.Router();
var api = require('../controller/api/user.api');
var midw = require('../middleware/api_auth');

router.post('/user', midw.api_auth, api.Update); // ds:  /api/users

router.post('/user/login', api.Login); // đăng nhập

router.post('/user/reg', api.Reg); // đăng ký

router.get('/user/profile', midw.api_auth, api.Profile); // lấy thông tin user
router.post('/user/profile', midw.api_auth, api.Profile); // lấy thông tin user

router.get('/user/logout', midw.api_auth, api.Logout); // đăng xuất

router.get('/pr', api.ListPr);

router.get('/ct', api.ListCt);

module.exports = router;