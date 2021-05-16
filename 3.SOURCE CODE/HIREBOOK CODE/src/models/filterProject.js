const mongoose = require("mongoose")

const FilterProject = new mongoose.Schema({
    date: {
        type: Date,


    },
    stipend: {
        type: Number,


    },
    duration: {
        type: String,

    },
    position: {
        type: String,

    },
    long: {
        type: String,

    },


    short: {
        type: String,
        required: true
    },



    admin: {
        type: String
    }
})


module.exports = mongoose.model("filterProject", FilterProject);
