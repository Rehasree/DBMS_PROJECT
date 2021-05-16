const mongoose = require("mongoose")

const ClientAgreement = new mongoose.Schema({
    // MoneyPaid: {
    //     type: Boolean,
    // },
    GigDetails:{
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    ProjectDetails:{
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    inTouchCardDetails: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    confirmed:{
        type : Boolean,
        default:false
    }
})

module.exports = mongoose.model("ClientAgreement", ClientAgreement);
