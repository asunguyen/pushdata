require("dotenv").config();
const express = require("express");
const mongose = require('mongoose');


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
    console.log(arrData[0]);
    console.log(arrData[1]);
    console.log(arrData[2]);
    console.log(arrData[3]);
    res.json({code: 200, data: "arrData"});
    
    
});




