const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    phone: {
        type: String,
    },
    name: {
        type: String,
    },
    phanthuong: {
        type: String
    },
    ma_kh: {
        type: String
    },
    mid: {
        type: String
    },
    khuvuc: {
        type: String
    },
    province: {
        type: String
    },
    voucher: {
        type: String
    },
    userCustom: {
        type: String,
        default: "true"
    },
    active: {
        type: String,
        default: "false"
    }
});

module.exports = mongoose.model("posts", UserSchema);