var db = require('./db');
const jwt = require('jsonwebtoken');//  Cần chạy lệnh cài đặt: npm install jsonwebtoken --save
require('dotenv').config(); // su dung thu vien doc file env:   npm install dotenv --save
const chuoi_ky_tu_bi_mat = process.env.TOKEN_SEC_KEY;
const bcrypt = require("bcrypt"); //cài bằng lệnh:  npm install bcrypt  --save 

//định nghĩa cấu truc cho model user
const usSchema = new db.mongoose.Schema(
    {
        username: { type: String, required: true }, //Bắt buộc có dữ liệu
        email: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, required: true },
        token: {  // trường hợp lưu nhiều token thì phải dùng mảng. Trong demo này sẽ dùng 1 token
            type: String,
            required: false
        }
    },
    {
        collection: 'User',
        timestamps: true
    }
);

usSchema.methods.generateAuthToken = async function () {
    const user = this
    console.log(user)
    const token = jwt.sign({ _id: user._id, username: user.username }, chuoi_ky_tu_bi_mat)
    // user.tokens = user.tokens.concat({token}) // code này dành cho nhiều token, ở demo này dùng 1 token
    user.token = token;
    await user.save()
    return null
}

usSchema.statics.findByCredentials = async (username, password) => {
    const user = await usModel.findOne({ username })
    if (!user) {
        throw new Error({ error: 'Không tồn tại user' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Sai password' })
    }
    return user
}

let usModel = db.mongoose.model('usModel', usSchema);
module.exports = { usModel };