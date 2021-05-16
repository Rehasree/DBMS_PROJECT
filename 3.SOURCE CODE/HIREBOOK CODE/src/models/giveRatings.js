const mongoose = require("mongoose")

const RatingData = new mongoose.Schema({
    rating: {
        type: Number,

    },
    admin: {
        type: String,
    },
    walletDetails: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    freelancer :{
        type : String,
        default:"",
    },
    received:{
        type : Boolean,
        default:false
    },
    cardID:{
        type : String,
    }
})


module.exports = mongoose.model("ratingData", RatingData);