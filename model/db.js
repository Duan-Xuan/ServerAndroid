const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/Assignment')
    .catch((err) => {
        console.log('Lỗi kết nối server');
        console.log(err);
    });
module.exports = { mongoose };