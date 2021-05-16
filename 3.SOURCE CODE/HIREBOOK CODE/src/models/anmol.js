const mongoose = require("mongoose")

const dekho = new mongoose.Schema({
    gigTitle: {
        type: String,
        required: true,

    },
    describeGig: {
        type: String,
        required: true

    },
    subCategory: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },

    image1: {
        type: String,
        // required: true
    },
    image2: {
        type: String,

    },
    image3: {
        type: String,

    },
    image4: {
        type: String,
        // required: true
    }


})


module.exports = mongoose.model("Krish", dekho);
