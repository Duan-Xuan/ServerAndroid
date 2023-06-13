var myMd = require('../model/user.model');
const bcrybt = require('bcrypt');

exports.TtAc = async (req, res, next) => {
    let msg = '';
    let ttAc = req.session.usLogin;
    if (req.method == 'POST') {
        //có tồn tại user
        if (req.body.password != req.body.password2) {
            msg = 'Password mới không trùng nhau';
        } else {
            let check_pass = await bcrybt.compare(req.body.passwordold, ttAc.password);
            if (check_pass) {
                let objUs = new myMd.usModel;
                //Xử lý mã hóa password
                //B1: tạo chuỗi bí mật
                const salt = await bcrybt.genSalt(15);
                console.log('Chuỗi ngẫu nhiên ' + salt);
                objUs.password = await bcrybt.hash(req.body.password, salt);
                objUs._id = ttAc._id;// thêm cho chức năng sửa
                //Cập nhật vào CSDL
                try {
                    await myMd.usModel.findByIdAndUpdate(ttAc._id, objUs);
                    return res.redirect('/ac/logout');
                } catch (error) {
                    msg = 'Lỗi cập nhật';
                    console.log(error);
                }
            } else {
                msg = 'Sai password';
            }
        }
    }
    res.render('account/ttAc', { title: 'Account', ttAc: ttAc, msg: msg });
}

exports.Login = async (req, res, next) => {
    let msg = '';
    if (req.method == 'POST') {
        try {
            let objUs = await myMd.usModel.findOne({ username: req.body.username });
            console.log(objUs);
            if (objUs != null) {
                //có tồn tại user
                let check_pass = await bcrybt.compare(req.body.password, objUs.password);
                if (check_pass) {
                    //đúng password ==> lưu vào session và chuyển trang
                    req.session.usLogin = objUs;
                    return res.redirect('/');
                } else {
                    msg = 'Sai password';
                }
            } else {
                msg = 'Không tồn tại user: ' + req.body.username;
            }
        } catch (error) {
            msg = error.message;
        }
    }
    res.render('account/login', { title: 'Login/Logout', msg: msg });
}

exports.Reg = async (req, res, next) => {
    let msg = '';
    if (req.method == 'POST') {
        console.log(req.body);
        if (req.body.password != req.body.password) {
            msg = 'Xác nhận password không đúng';
            return res.render('account/reg', { msg: msg });
        }
        try {
            let objUs = new myMd.usModel;
            objUs.username = req.body.username;
            objUs.email = req.body.email;

            //Xử lý mã hóa password
            //B1: tạo chuỗi bí mật
            const salt = await bcrybt.genSalt(15);
            console.log('Chuỗi ngẫu nhiên ' + salt);
            // objUs.password = req.body.passwd;
            objUs.password = await bcrybt.hash(req.body.password, salt);
            objUs.role = 'user';

            await objUs.save();
            msg = 'Đăng ký thành công';
        } catch (error) {
            msg = 'Lỗi' + error.message;
        }
    }
    res.render('account/reg', { title: 'Register', msg: msg });
};

exports.Logout = (req, res, next) => {
    if (req.session != null)
        req.session.destroy(function () {
            console.log("Đăng xuất thành công")
            res.redirect('/ac/login');
        });
}