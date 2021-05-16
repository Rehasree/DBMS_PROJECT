const mongoose = require("mongoose");

const InTouch = new mongoose.Schema({
    client: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "gigEdit"
        },
        owner: String
    },
    freelancer: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProjectDetails"
        },
        owner: String
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    userName: {
        type: String,
        required: true
    },
    admin: {
        type: String
    },
    role: {
        type: String,
        enum: ['freelancer', 'client']
    },
    applied:{
        type : Boolean,
        default:false
    }
})

module.exports = mongoose.model("inTouch", InTouch);
