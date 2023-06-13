var express = require('express');
var router = express.Router();
var usController = require('../controller/user.controller');

var check_login = require('../middleware/check_login');

//tạo middleware chung cho tất cả các router
router.use((req, res, next) => {
    console.log('-----> gọi vào middleware ----->');
    next(); //thuc hiện công việc tiếp theo
});

//Lấy ds
router.get('/', usController.listUs);
//Thêm ds
router.post('/', check_login.yeu_cau_dang_nhap, usController.addUs);
//Thông tin
router.get('/ttUs/:idUs', usController.ttUs);
//Sửa
router.post('/ttUs/:idUs', check_login.yeu_cau_dang_nhap, usController.updateUs);
//Xóa
router.get('/delete/:idUs', check_login.yeu_cau_dang_nhap, usController.deleteUs);
//Thêm sau khi xóa
router.post('/delete/:idUs', check_login.yeu_cau_dang_nhap, usController.addUs);
module.exports = router;