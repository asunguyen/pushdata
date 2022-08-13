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

let readXlsxFile = require('read-excel-file/node');
let arrData;
let totalRowsCard;
let totalRowsVoucher5;
let totalRowsVoucher10;
var getDataExcel = async function () {
    console.log(1);
    totalRowsCard = await readXlsxFile('public/DATA_UP_220808.xlsx', { sheet: "Card" }).then((rows) => {
        return rows;
    });
    totalRowsVoucher5 = await readXlsxFile('public/DATA_UP_220808.xlsx', { sheet: "Voucher 5%" }).then((rows) => {
        return rows;
    });
    totalRowsVoucher10 = await readXlsxFile('public/DATA_UP_220808.xlsx', { sheet: "Voucher 10%" }).then((rows) => {
        return rows;
    });
    arrData = totalRowsCard.concat(totalRowsVoucher5, totalRowsVoucher10);
    console.log(2);
}
getDataExcel();


app.get("/", (req, res) => {

    res.render("trangchu");
});
app.post("/read-file", async (req, res) => {
    try {
        const dataCount = await Count.findOne();
        let number = 0;
        let numberCard = 0;
        let number5 = 0;
        let number10 = 0;
        if (dataCount) {
            number = dataCount.countdata;
            numberCard = dataCount.countCard;
            number5 = dataCount.count5;
            number10 = dataCount.count10;
        }
        //push card
        if (number % 9 == 0) {
            if (totalRowsCard && totalRowsCard[numberCard] && totalRowsCard[numberCard][1] && totalRowsCard[numberCard][1] != "Mã Khách Hàng") {
                const newUser = new User({
                    phone: totalRowsCard[numberCard][3],
                    name: totalRowsCard[numberCard][2],
                    phanthuong: totalRowsCard[numberCard][5],
                    ma_kh: totalRowsCard[numberCard][1],
                    mid: totalRowsCard[numberCard][3],
                    khuvuc: totalRowsCard[numberCard][4],
                    province: totalRowsCard[numberCard][4],
                    voucher: totalRowsCard[numberCard][6],
                    userCustom: "true"
                });
                await newUser.save();
                numberCard++;
                number++
                await Count.findByIdAndUpdate(dataCount._id, { count10: number10, count5: number5, countdata: number, countCard: numberCard });
                res.json({ code: 200, user: newUser });
            } else {
                number++;
                numberCard++;
                await Count.findByIdAndUpdate(dataCount._id, { count10: number10, count5: number5, countdata: number, countCard: numberCard });
                if (number < arrData.length) {
                    res.json({ code: 200, user: {} });
                } else {
                    res.json({ code: 200, user: {}, done: "true" });
                }

            }
        }
        // push voucher 5%
        if (number % 9 == 1 || number % 9 == 2 || number % 9 == 3 || number % 9 == 7) {
            if (totalRowsVoucher5 && totalRowsVoucher5[number5] && totalRowsVoucher5[number5][1] && totalRowsVoucher5[number5][1] != "Mã Khách Hàng") {
                const newUser = new User({
                    phone: totalRowsVoucher5[number5][3],
                    name: totalRowsVoucher5[number5][2],
                    phanthuong: totalRowsVoucher5[number5][5],
                    ma_kh: totalRowsVoucher5[number5][1],
                    mid: totalRowsVoucher5[number5][3],
                    khuvuc: totalRowsVoucher5[number5][4],
                    province: totalRowsVoucher5[number5][4],
                    voucher: totalRowsVoucher5[number5][6],
                    userCustom: "true"
                });
                await newUser.save();
                number5++;
                number++
                await Count.findByIdAndUpdate(dataCount._id, { count10: number10, count5: number5, countdata: number, countCard: numberCard });
                res.json({ code: 200, user: newUser });
            } else {
                number++;
                number5++;
                await Count.findByIdAndUpdate(dataCount._id, { count10: number10, count5: number5, countdata: number, countCard: numberCard });
                if (number < arrData.length) {
                    res.json({ code: 200, user: {} });
                } else {
                    res.json({ code: 200, user: {}, done: "true" });
                }

            }
        }
        //push voucher 10
        if (number % 9 == 4 || number % 9 == 5 || number % 9 == 6 || number % 9 == 8) {
            if (totalRowsVoucher10 && totalRowsVoucher10[number10] && totalRowsVoucher10[number10][1] && totalRowsVoucher10[number10][1] != "Mã Khách Hàng") {
                const newUser = new User({
                    phone: totalRowsVoucher10[number10][3],
                    name: totalRowsVoucher10[number10][2],
                    phanthuong: totalRowsVoucher10[number10][5],
                    ma_kh: totalRowsVoucher10[number10][1],
                    mid: totalRowsVoucher10[number10][3],
                    khuvuc: totalRowsVoucher10[number10][4],
                    province: totalRowsVoucher10[number10][4],
                    voucher: totalRowsVoucher10[number10][6],
                    userCustom: "true"
                });
                await newUser.save();
                number10++;
                number++
                await Count.findByIdAndUpdate(dataCount._id, { count10: number10, count5: number5, countdata: number, countCard: numberCard });
                res.json({ code: 200, user: newUser });
            } else {
                number++;
                number10++;
                await Count.findByIdAndUpdate(dataCount._id, { count10: number10, count5: number5, countdata: number, countCard: numberCard });
                if (number < arrData.length) {
                    res.json({ code: 200, user: {} });
                } else {
                    res.json({ code: 200, user: {}, done: "true" });
                }

            }
        }
    } catch (err) {
        res.json({ code: 200, user: {} });
    }
});




