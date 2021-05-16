const mongoose = require("mongoose")

const GigEdit = new mongoose.Schema({
    gigTitle: {
        type: String,
        required: true,
    },
    describeGig: {
        type: String,
        required: true
    },
    gigCategory: {
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

    image4: String,
    admin: {
        type: String
    }


})


module.exports = mongoose.model("gigEdit", GigEdit);
