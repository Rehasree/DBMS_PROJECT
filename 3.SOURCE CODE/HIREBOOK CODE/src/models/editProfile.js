const mongoose = require("mongoose")

const editProfile = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,

    },
    lastName: {
        type: String,
        required: true

    },
    headLine: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },


    city: {
        type: String,
        required: true
    },

    state: {
        type: String,
        required: true
    },
    zip: {
        type: Number,
        required: true
    },
    skills: {
        type: String,
        required: true
    },
    gradDate: {
        type: String,
        required: true
    },
    admin: {
        type: String
    }
})


module.exports = mongoose.model("editProfile", editProfile);
