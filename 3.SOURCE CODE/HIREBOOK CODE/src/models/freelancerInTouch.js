const mongoose = require("mongoose");
const projectEditSchema = require("./projectEditSchema");

const FreelancerInTouch = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProjectDetails"
    },
    userName: {
        type: String,
        required: true
    },
    admin: {
        type: String
    }
})


module.exports = mongoose.model("freelancerInTouch", FreelancerInTouch);
