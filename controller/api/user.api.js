var myMd = require('../../model/user.model');
var myMd2 = require('../../model/product.model');
const bcrypt = require('bcrypt');

exports.List = async (req, res, next) => {
    try {
        let list = await myMd.usModel.find();
        if (list) {
            return res.status(200).json({ data: list, msg: 'Lấy dữ liệu thành công' });
        } else {
            return res.status(204).json({ msg: 'Không có dữ liệu' });
        }
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

exports.ListPr = async (req, res, next) => {
    try {
        let list = await myMd2.prModel.find();
        if (list) {
            return res.status(200).json({ data: list, msg: 'Lấy dữ liệu thành công' });
        } else {
            return res.status(204).json({ msg: 'Không có dữ liệu' });
        }
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

exports.ListCt = async (req, res, next) => {
    try {
        let list = await myMd2.ctModel.find();
        if (list) {
            return res.status(200).json({ data: list, msg: 'Lấy dữ liệu thành công' });
        } else {
            return res.status(204).json({ msg: 'Không có dữ liệu' });
        }
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

exports.Login = async (req, res, next) => {
    try {
        const user = await myMd.usModel
            .findByCredentials(req.body.username, req.body.password)
        if (!user) {
            return res.status(401)
                .json({ error: 'Sai thông tin đăng nhập' })
        }
        // đăng nhập thành công, tạo token làm việc mới
        const token = await user.generateAuthToken()
        return res.status(200).send({ user, token })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}

exports.Reg = async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const user = new myMd.usModel(req.body);
        user.password = await bcrypt.hash(req.body.password, salt);
        const token = await user.generateAuthToken();
        let new_u = await user.save()
        return res.status(201).json({ user: new_u, token })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}


exports.Update = async (req, res, next) => {
    try {
        const user = await myMd.usModel
            .findByCredentials(req.body.username, req.body.passwordOld)
        let objUs = new myMd.usModel;
        //Xử lý mã hóa password
        //B1: tạo chuỗi bí mật
        const salt = await bcrypt.genSalt(10);
        objUs.password = await bcrypt.hash(req.body.password, salt);
        objUs._id = user._id;// thêm cho chức năng sửa
        await myMd.usModel.findByIdAndUpdate(user._id, objUs);
        return res.status(200).json({ msg: 'Cập nhật thành công' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}

exports.Profile = (req, res, next) => {
    res.send(req.user)
}

exports.Logout = async (req, res, next) => {
    try {
        console.log(req.user);
        // req.user.generateAuthToken();
        req.user.token = null; //xóa token
        await req.user.save()
        return res.status(200).json({ msg: 'Đăng xuất thành công' });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
}