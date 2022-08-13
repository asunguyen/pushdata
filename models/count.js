const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CountSchema = new Schema({
    countdata: {
        type: String
    },
    countCard: {
        type: String
    },
    count5: {
        type: String
    },
    count10: {
        type: String
    }
});

module.exports = mongoose.model("counts", CountSchema);