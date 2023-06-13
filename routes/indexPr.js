var express = require('express');
var router = express.Router();
var prController = require('../controller/product.controller');
var multer = require('multer');
var objUpload = multer({ dest: './tmp' });
var check_login = require('../middleware/check_login');

//tạo middleware chung cho tất cả các router
router.use((req, res, next) => {
    console.log('-----> gọi vào middleware ----->');
    next(); //thuc hiện công việc tiếp theo
});

//Lấy
router.get('/', prController.listPr);
//Thêm
router.post('/', check_login.yeu_cau_dang_nhap, objUpload.single("avatar"), prController.addPr);
//Thông tin
router.get('/ttPr/:idPr', prController.ttPr);
//Sửa
router.post('/ttPr/:idPr', check_login.yeu_cau_dang_nhap, objUpload.single("avatar"), prController.updatePr);
//Xóa
router.get('/delete/:idPr', check_login.yeu_cau_dang_nhap, prController.deletePr);
//Thêm sau khi xóa
router.post('/delete/:idPr', check_login.yeu_cau_dang_nhap, objUpload.single("avatar"), prController.addPr);




//Lấy
router.get('/ct', prController.listCt);
//Thêm
router.post('/ct', check_login.yeu_cau_dang_nhap, prController.addCt);
//Thông tin
router.get('/ct/ttCt/:idCt', prController.ttCt);
//Sửa
router.post('/ct/ttCt/:idCt', check_login.yeu_cau_dang_nhap, prController.updateCt);
//Xóa
router.get('/ct/delete/:idCt', check_login.yeu_cau_dang_nhap, prController.deleteCt);
//Thêm sau khi xóa
router.post('/ct/delete/:idCt', check_login.yeu_cau_dang_nhap, prController.addCt);
module.exports = router;