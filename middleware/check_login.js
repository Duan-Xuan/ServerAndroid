exports.yeu_cau_dang_nhap = (req, res, next) => {
    console.log(req.session.usLogin);
    if (req.session.usLogin) {
        //đã đăng nhập
        next();
    } else {
        //điều hướng về trang đăng nhập
        res.redirect('/ac/login');
    }
}