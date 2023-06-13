var myMd = require('../model/user.model');
const bcrybt = require('bcrypt');
var checkCot = false;

//Hiên danh sách
exports.listUs = async (req, res, next) => {
    let loc_username = null;
    let loc_cot = null;
    if (typeof (req.query.username) != 'undefined') {
        if (req.query.username != '')
            loc_username = { username: req.query.username }; // tìm chính xác
        else
            loc_username = null;
    }
    if (typeof (req.query.loc_cot) != 'undefined') {
        if (req.query.loc_cot == 2) {
            if (checkCot) {
                checkCot = !checkCot;
                loc_cot = { username: -1 };
            } else {
                checkCot = !checkCot;
                loc_cot = { username: 1 };
            }
        }
        if (req.query.loc_cot == 3) {
            if (checkCot) {
                checkCot = !checkCot;
                loc_cot = { email: -1 };
            } else {
                checkCot = !checkCot;
                loc_cot = { email: 1 };
            }
        }
        if (req.query.loc_cot == 4) {
            if (checkCot) {
                checkCot = !checkCot;
                loc_cot = { role: -1 };
            } else {
                checkCot = !checkCot;
                loc_cot = { role: 1 };
            }
        }
    }
    let us = await myMd.usModel.find(loc_username).sort(loc_cot);
    console.log(us);
    res.render('user/listUs', { title: 'User', us: us, ttAc: req.session.usLogin });
}

//Thêm
exports.addUs = async (req, res, next) => {
    //Tải lên mongo
    if (req.method == 'POST') {
        let objUs = new myMd.usModel;
        objUs.username = req.body.username;
        objUs.email = req.body.email;
        //Xử lý mã hóa password
        //B1: tạo chuỗi bí mật
        const salt = await bcrybt.genSalt(15);
        console.log('Chuỗi ngẫu nhiên ' + salt);
        objUs.password = await bcrybt.hash(req.body.password, salt);

        objUs.role = req.body.role;
        //Ghi vào CSDL
        try {
            let newUs = await objUs.save();
            console.log(newUs);
        } catch (error) {
            console.log(error);
        }
    }
    let us = await myMd.usModel.find();
    res.render('user/listUs', { title: 'User', us: us });
}

//Thông tin
exports.ttUs = async (req, res, next) => {
    let msg = '';
    let idUs = req.params.idUs;
    let objUs = await myMd.usModel.findById(idUs);
    res.render('user/ttUs', { title: 'Information User', us: objUs, msg: msg, ttAc: req.session.usLogin });
}

//Sửa
exports.updateUs = async (req, res, next) => {
    let msg = '';
    let idUs = req.params.idUs;
    if (req.method == 'POST') {
        // kiểm tra hợp lệ dữ liệu nếu có....
        // tạo model để gán dữ liệu
        let objUs = new myMd.usModel;
        objUs.username = req.body.username;
        objUs.email = req.body.email;
        objUs.role = req.body.role;
        objUs._id = idUs;// thêm cho chức năng sửa
        //Cập nhật vào CSDL
        try {
            await myMd.usModel.findByIdAndUpdate(idUs, objUs);
            msg = 'Cập nhật thành công';
        } catch (error) {
            console.log(error);
        }
    }
    let objUs = await myMd.usModel.findById(idUs);
    res.render('user/ttUs', { title: 'Information User', us: objUs, msg: msg, ttAc: req.session.usLogin });
}

//Xóa
exports.deleteUs = async (req, res, next) => {
    let idUs = req.params.idUs;
    // Xóa khỏi CSDL
    try {
        await myMd.usModel.findByIdAndDelete(idUs);
    } catch (error) {
        console.log(error);
    }
    let us = await myMd.usModel.find();
    res.render('user/listUs', { title: 'User', us: us, ttAc: req.session.usLogin });
}