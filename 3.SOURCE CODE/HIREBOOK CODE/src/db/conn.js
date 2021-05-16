const mongoose = require("mongoose")
  mongoose.connect("mongodb+srv://Reha:Reha@2002@cluster0.pejef.mongodb.net/HireBook?retryWrites=true&w=majority", { 
    //  mongoose.connect("mongodb://localhost:27017/april5", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log("connection successful");
}).catch((e) => {
    console.log(e);
})