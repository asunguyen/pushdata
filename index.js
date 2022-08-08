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



const PORT = 5000;

app.listen(PORT, () => console.log("start serve"))


app.get("/", (req, res) => {
    res.render("trangchu");
})