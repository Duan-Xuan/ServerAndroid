var fs = require('fs');
var myMd = require('../model/product.model');
var checkCot = false;
//Lấy ds
exports.listPr = async (req, res, next) => {
    let loc_category = null;
    let loc_cot = null;
    if (typeof (req.query.category) != 'undefined') {
        loc_category = { id_category: req.query.category }; // tìm chính xác
    }
    if (typeof (req.query.loc_cot) != 'undefined') {
        if (req.query.loc_cot == 2) {
            if (checkCot) {
                checkCot = !checkCot;
                loc_cot = { name: -1 };
            } else {
                checkCot = !checkCot;
                loc_cot = { name: 1 };
            }
        }
        if (req.query.loc_cot == 6) {
            if (checkCot) {
                checkCot = !checkCot;
                loc_cot = { price: -1 };
            } else {
                checkCot = !checkCot;
                loc_cot = { price: 1 };
            }
        }
    }
    let pr = await myMd.prModel.find(loc_category).sort(loc_cot).populate('id_category');
    console.log(pr);
    let ct = await myMd.ctModel.find();
    res.render('product/listPr', { title: 'Product', pr: pr, ct: ct, ttAc: req.session.usLogin });
}
//Thêm
exports.addPr = async (req, res, next) => {
    if (req.method == 'POST') {
        fs.renameSync(req.file.path,
            './public/images/' + req.file.originalname);

        let objPr = new myMd.prModel;
        objPr.name = req.body.name;
        objPr.id_category = req.body.category;
        objPr.avatar = 'http://localhost:3000/images/' + req.file.originalname;
        objPr.description = req.body.description;
        objPr.price = req.body.price;
        //Ghi vào CSDL
        try {
            let newPr = await objPr.save();
            console.log(newPr);
        } catch (error) {
            console.log(error);
        }
    }
    let pr = await myMd.prModel.find().populate('id_category');
    let ct = await myMd.ctModel.find();
    res.render('product/listPr', { title: 'Product', pr: pr, ct: ct });
}
//Thông tin
exports.ttPr = async (req, res, next) => {
    let msg = '';
    let idPr = req.params.idPr;
    let objPr = await myMd.prModel.findById(idPr);
    let ct = await myMd.ctModel.find();
    res.render('product/ttPr', { title: 'Information Product', pr: objPr, ct: ct, msg: msg, ttAc: req.session.usLogin });
}
//Sửa
exports.updatePr = async (req, res, next) => {
    let msg = '';
    let idPr = req.params.idPr;
    if (req.method == 'POST') {
        fs.renameSync(req.file.path,
            './public/images/' + req.file.originalname);

        let objPr = new myMd.prModel;
        objPr.name = req.body.name;
        objPr.id_category = req.body.category;
        objPr.avatar = 'http://localhost:3000/images/' + req.file.originalname;
        objPr.description = req.body.description;
        objPr.price = req.body.price;
        objPr._id = idPr;// thêm cho chức năng sửa
        //Ghi vào CSDL
        try {
            await myMd.prModel.findByIdAndUpdate(idPr, objPr);
            msg = 'Cập nhật thành công';
        } catch (error) {
            console.log(error);
        }
    }
    let objPr = await myMd.prModel.findById(idPr);
    let ct = await myMd.ctModel.find();
    res.render('product/ttPr', { title: 'Information Product', pr: objPr, ct: ct, msg: msg, ttAc: req.session.usLogin });
}

//Xóa
exports.deletePr = async (req, res, next) => {
    let idPr = req.params.idPr;
    // Xóa khỏi CSDL
    try {
        await myMd.prModel.findByIdAndDelete(idPr);
    } catch (error) {
        console.log(error);
    }
    let pr = await myMd.prModel.find().populate('id_category');
    let ct = await myMd.ctModel.find();
    res.render('product/listPr', { title: 'Product', pr: pr, ct: ct, ttAc: req.session.usLogin });
}

//Lấy ds
exports.listCt = async (req, res, next) => {
    let loc_name = null;
    let loc_cot = null;
    if (typeof (req.query.name) != 'undefined') {
        if (req.query.name != '')
            loc_name = { name: req.query.name }; // tìm chính xác
        else
            loc_name = null;
    }
    if (typeof (req.query.loc_cot) != 'undefined') {
        if (req.query.loc_cot == 2) {
            if (checkCot) {
                checkCot = !checkCot;
                loc_cot = { name: -1 };
            } else {
                checkCot = !checkCot;
                loc_cot = { name: 1 };
            }
        }
    }
    let ct = await myMd.ctModel.find(loc_name).sort(loc_cot);
    res.render('product/listCt', { title: 'Category', ct: ct, ttAc: req.session.usLogin });
}

//Thêm
exports.addCt = async (req, res, next) => {
    if (req.method == 'POST') {
        let objCt = new myMd.ctModel;
        objCt.name = req.body.name;
        try {
            let newCt = await objCt.save();
            console.log(newCt);
        } catch (error) {
            console.log(error);
        }
    }
    let ct = await myMd.ctModel.find();
    res.render('product/listCt', { title: 'Category', ct: ct });
}

//Thông tin
exports.ttCt = async (req, res, next) => {
    let msg = '';
    let idCt = req.params.idCt;
    let objCt = await myMd.ctModel.findById(idCt);
    res.render('product/ttCt', { title: 'Information Category', ct: objCt, msg: msg, ttAc: req.session.usLogin });
}
//Sửa
exports.updateCt = async (req, res, next) => {
    let msg = '';
    let idCt = req.params.idCt;
    if (req.method == 'POST') {
        let objCt = new myMd.ctModel;
        objCt.name = req.body.name;
        objCt._id = idCt;// thêm cho chức năng sửa
        //Ghi vào CSDL
        try {
            await myMd.ctModel.findByIdAndUpdate(idCt, objCt);
            msg = 'Cập nhật thành công';
        } catch (error) {
            console.log(error);
        }
    }
    let objCt = await myMd.ctModel.findById(idCt);
    res.render('product/ttCt', { title: 'Information Category', ct: objCt, msg: msg, ttAc: req.session.usLogin });
}

//Xóa
exports.deleteCt = async (req, res, next) => {
    let idCt = req.params.idCt;
    // Xóa khỏi CSDL
    try {
        await myMd.ctModel.findByIdAndDelete(idCt);
    } catch (error) {
        console.log(error);
    }
    let ct = await myMd.ctModel.find();
    res.render('product/listCt', { title: 'Category', ct: ct, ttAc: req.session.usLogin });
}