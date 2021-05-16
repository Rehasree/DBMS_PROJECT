const mongoose = require("mongoose")

const projects = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    positionAvailable: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    applyBy: {
        type: Date,
        required: true
    },
    projectType: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    stipend: {
        type: Number,
        required: true
    },
    skills: {
        type: String,
        required: true

    },
    // eligibility: {
    //     type: String,
    //     required: true
    // },
    // city: {
    //     type: String,
    //     required: true
    // },

    // zip: {
    //     type: Number,
    //     required: true
    // },
    // perks: {
    //     type: String,
    //     required: true
    // },
    workLocation: {
        type: String,
        require: true
    },
    openings: {
        type: Number,
        required: true
    },
    weblink: {
        type: String,
        required: true
    },
    companyLocation: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    workJD: {
        type: String,
        required: true
    },
   
    admin: {
        type: String
    }

})

const ProjectDetails = new mongoose.model("ProjectDetails", projects)
module.exports = ProjectDetails
