var express = require('express');
var router = express.Router();
var acController = require('../controller/account.controller');

var check_login = require('../middleware/check_login');

router.use((req, res, next) => {
    console.log('-----> gọi vào middleware ----->');
    next();
});

//lay us
router.get('/', check_login.yeu_cau_dang_nhap, acController.TtAc);
//sua us
router.post('/', acController.TtAc);
//dang nhap
router.get('/login', acController.Login);
router.post('/login', acController.Login);
//dang ky
router.get('/reg', acController.Reg);
router.post('/reg', acController.Reg);
//dang xuat
router.get('/logout', acController.Logout);
module.exports = router;