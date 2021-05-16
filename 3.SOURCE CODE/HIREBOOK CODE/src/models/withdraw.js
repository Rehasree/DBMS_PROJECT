const mongoose = require("mongoose")

const WithdrawAmount = new mongoose.Schema({
    amount: {
        type: Number,

    },
    admin: {
        type: String,
    }
})


module.exports = mongoose.model("withdrawAmount", WithdrawAmount);