const mongoose = require("mongoose")

const PaymentData = new mongoose.Schema({
    amount: {
        type: Number,
    },
    customerId:{
        type : String,
    },
    customerEmail:{
        type : String
    },
    customerPhone :{
        type: String
    }
})


module.exports = mongoose.model("PaymentData", PaymentData);
