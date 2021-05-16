const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose");
const freelancerSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    }

})
freelancerSchema.plugin(passportLocalMongoose);
// generating token for user authentication
// freelancerSchema.methods.generateAuthToken = async function () {
//     try {
//         const token = await jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
//         this.tokens = this.tokens.concat({ token: token })
//         await this.save();
//         return token;
//     } catch (error) {
//         res.send("the error part " + error);
//         console.log("the error part " + error)
//     }
// }

// securing password by hashing
// freelancerSchema.pre("save", async function (next) {
//     if (this.isModified("password")) {

//         this.password = await bcrypt.hash(this.password, 10);
//         this.confirmpassword = await bcrypt.hash(this.password, 10);

//     }
//     next();
// })
module.exports = mongoose.model("User", freelancerSchema);
