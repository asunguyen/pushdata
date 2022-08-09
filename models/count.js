const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CountSchema = new Schema({
    countdata: {
        type: String
    }
});

module.exports = mongoose.model("counts", CountSchema);