const mongoose = require("mongoose")

const BankDetails = new mongoose.Schema({
    don: {
        type: String,
    },
    accNum: {
        type: Number,
    },
    ifscCode: {
        type: String,

    },
    upiID: {
        type: String,

    },

    admin: {
        type: String,
    }
})


module.exports = mongoose.model("bankDetails", BankDetails);