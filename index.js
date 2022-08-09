require("dotenv").config();
const express = require("express");
const mongose = require('mongoose');

const User = require("./models/users");
const Count = require("./models/count");

const connectDB = async () => {
    try {
        await mongose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.2c3qnal.mongodb.net/?retryWrites=true&w=majority`, {

        });
        console.log("đã kết nối DB");
    } catch (error) {
        console.log("bug", error);
    }
}
connectDB();
const app = express();
app.use(express.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET", "PUT", "POST", "DELETE", "OPTION");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "ejs");



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("start serve"))


app.get("/", (req, res) => {
    res.render("trangchu");
});

app.get("/read-file", async(req, res) => {
    //[Voucher 5%, Card, Voucher 10%]

    
    //res.json({code: 200, data: "arrData"});
    
    //

    const dataCount = await Count.findOne();
    let number = 0;
    if (dataCount) {
        number = dataCount.countdata;
    }
    let readXlsxFile = require('read-excel-file/node');
    let totalRowsCard = await readXlsxFile('public/DATA_UP_220808.xlsx', {sheet: "Card"}).then((rows) => {
        return rows;
    });
    let totalRowsVoucher5 = await readXlsxFile('public/DATA_UP_220808.xlsx', {sheet: "Voucher 5%"}).then((rows) => {
        return rows;
    });
    let totalRowsVoucher10 = await readXlsxFile('public/DATA_UP_220808.xlsx', {sheet: "Voucher 10%"}).then((rows) => {
        return rows;
    });
    let arrData = totalRowsCard.concat(totalRowsVoucher5, totalRowsVoucher10);
    if (arrData && arrData[number] && arrData[number][1] && arrData[number][1] != "Mã Khách Hàng") {
        const newUser = new User({
            phone: arrData[number][3],
            name: arrData[number][2],
            phanthuong: arrData[number][5],
            ma_kh: arrData[number][1],
            mid: arrData[number][3],
            khuvuc: arrData[number][4],
            province: arrData[number][4],
            voucher: arrData[number][6],
            userCustom: "true"
        });
        await newUser.save();
        number++;
        if (dataCount) {
            await Count.findByIdAndUpdate(dataCount._id, {countdata: number});
        } else{
            const newCount = new Count({
                countdata: number
            });
            await newCount.save();
        }
    } else {
        number++;
        if (dataCount) {
            await Count.findByIdAndUpdate(dataCount._id, {countdata: number});
        } else{
            const newCount = new Count({
                countdata: number
            });
            await newCount.save();
        }
    }
    // call lại hàm
    res.json({data: "xong"});
});




