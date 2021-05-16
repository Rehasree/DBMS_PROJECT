require("dotenv").config();
const { static, Router } = require("express");
const express = require("express");
const path = require("path")
const hbs = require("hbs")
const ejs = require("ejs")
const passport = require("passport")
const localStrategy = require("passport-local")
const methodOverride = require("method-override")
const ContactPart = require("./models/contact")
const fs = require("fs")
const bcrypt = require("bcryptjs")
const multer = require("multer")
var upload = multer({ dest: "./assets/uploads/" })
var flash = require('connect-flash');
// const { isAuthenticated } = require("./middleware/index")
//var uploadForGigs = multer({ dest: "./assets/uploadsForGigs/" })
const app = express();
require("./db/conn")
const Register = require("./models/register")
const ProjectPart = require("./models/projectEditSchema");
const GigPart = require("./models/gigEdit");
const EditProfile = require("./models/editProfile");
const InTouch = require("./models/inTouch");
const ClientAgreement = require("./models/ClientAgreement")
const GiveRating = require("./models/giveRatings")
const WithDrawMoney = require("./models/withdraw")
const EditBankDetail = require("./models/editBankDetails")
const FilterPart = require("./models/filterProject")


const FreelancerInTouch = require("./models/freelancerInTouch");
const { isLoggedIn } = require("./middleware/index")
const bodyParser = require("body-parser");
const editProfile = require("./models/editProfile");
const PaymentData = require("./models/Payment")
const { profile } = require("console");
const { constants } = require("crypto");
const port = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../assets")
//chat app begins
const http = require('http');
const inTouch = require("./models/inTouch");
const e = require("express");
const server = http.createServer(app);

//chat app ends
//payment begins
const qs = require("querystring");
const checksum_lib = require("./Paytm/checksum");
const config = require("./Paytm/config");
const { findById } = require("./models/giveRatings");
const ProjectDetails = require("./models/projectEditSchema");
const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });
//payment ends
const storage = multer.diskStorage({
    destination: "./assets/uploads/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
})

var upload = multer({
    storage: storage
}).single("image4")


app.use(require("express-session")({
    secret: "My name is Anmol",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Register.authenticate()));
passport.serializeUser(Register.serializeUser());
passport.deserializeUser(Register.deserializeUser());

app.use(methodOverride("_method"))
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next();
});

app.use(express.static(static_path))
app.set("view engine", "hbs")
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {

    res.render("index");
})
app.get("/index", (req, res) => {
    res.render("index");
})
app.get("/signup", (req, res) => {
    res.render("signup");
})

app.get("/contact", (req, res) => {
    res.render("contact")
})
app.get("/ProfileEdit", (req, res) => {
    res.render("ProfileEdit")
})
// app.get("/freelancers", (req, res) => {
//     res.render("freelancers")
// })
app.get("/GigEdit", (req, res) => {
    res.render("GigEdit")
})
app.get("/Homepage2", isLoggedIn, (req, res) => {
    const admin = req.user.username
    res.render("Homepage2",{admin})
})
app.get("/signin", (req, res) => {
    res.render("signin")
})
app.get("/Profile", (req, res) => {
    res.render("Profile")
})
app.get("/ProfileEdit", (req, res) => {
    res.render("Profile")
})
app.get("/projectEdit", (req, res) => {
    res.render("projectEdit")
})
app.get("/help", (req, res) => {
    res.render("help")
})
app.get("/payment", (req, res) => {
    res.render("payment")
})
app.get("/sidebar/ratings", (req, res) => {
    res.render("sidebar")
})
app.get("/sidebar/withdraw", (req, res) => {
    res.render("sidebar")
})
app.get("/sidebar/bankDetails", (req, res) => {
    res.render("sidebar")
})
app.get("/Projects/filters", (req, res) => {
    res.render("/Projects")
})

app.get("/sidebar/intouch/<%= row._id %>", (req, res) => {
    res.render("/payment")
})
app.get("/team",(req,res)=>{
    res.render("team")
})
// Payment system post req
app.post("/payment", [parseUrl, parseJson], (req, res) => {
    // Route for making payment
    const PaymentData1 = new PaymentData({
        amount: req.body.amount,
        customerId: req.body.user,
        customerEmail: req.body.email,
        customerPhone: req.body.phone
    })
    const registered = PaymentData1.save();
    var paymentDetails = {
        amount: req.body.amount,
        customerId: req.body.name,
        customerEmail: req.body.email,
        customerPhone: req.body.phone
    }
    if (!paymentDetails.amount || !paymentDetails.customerId || !paymentDetails.customerEmail || !paymentDetails.customerPhone) {
        res.status(400).send('Payment failed')
    } else {
        var params = {};
        params['MID'] = config.PaytmConfig.mid;
        params['WEBSITE'] = config.PaytmConfig.website;
        params['CHANNEL_ID'] = 'WEB';
        params['INDUSTRY_TYPE_ID'] = 'Retail';
        params['ORDER_ID'] = 'TEST_' + new Date().getTime();
        params['CUST_ID'] = paymentDetails.customerId;
        params['TXN_AMOUNT'] = paymentDetails.amount;
        params['CALLBACK_URL'] = 'http://localhost:3000/callback';
        params['EMAIL'] = paymentDetails.customerEmail;
        params['MOBILE_NO'] = paymentDetails.customerPhone;


        checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
            var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
            // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production

            var form_fields = "";
            for (var x in params) {
                form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
            }
            form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
            res.end();
        });
    }
});
app.post("/callback", (req, res) => {
    // Route for verifiying payment

    var body = '';

    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        var html = "";
        var post_data = qs.parse(body);

        // received params in callback
        console.log('Callback Response: ', post_data, "\n");


        // verify the checksum
        var checksumhash = post_data.CHECKSUMHASH;
        // delete post_data.CHECKSUMHASH;
        var result = checksum_lib.verifychecksum(post_data, config.PaytmConfig.key, checksumhash);
        console.log("Checksum Result => ", result, "\n");


        // Send Server-to-Server request to verify Order Status
        var params = { "MID": config.PaytmConfig.mid, "ORDERID": post_data.ORDERID };

        checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {

            params.CHECKSUMHASH = checksum;
            post_data = 'JsonData=' + JSON.stringify(params);

            var options = {
                hostname: 'securegw-stage.paytm.in', // for staging
                // hostname: 'securegw.paytm.in', // for production
                port: 443,
                path: '/merchant-status/getTxnStatus',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': post_data.length
                }
            };


            // Set up the request
            var response = "";
            var post_req = https.request(options, function (post_res) {
                post_res.on('data', function (chunk) {
                    response += chunk;
                });

                post_res.on('end', function () {
                    console.log('S2S Response: ', response, "\n");

                    var _result = JSON.parse(response);
                    if (_result.STATUS == 'TXN_SUCCESS') {
                        res.send('payment sucess')
                    } else {
                        res.send('payment failed')
                    }
                });
            });

            // post the data
            post_req.write(post_data);
            post_req.end();
        });
    });
});

//payment system get request
app.get("/sidebar", isLoggedIn, async (req, res) => {
    try {
        const { username } = req.user;
        const prjct = await GigPart.find({
            admin: username
        })
        const prfile = await EditProfile.find({
            admin: username
        })
        const intouchDetails = await InTouch.find({ $or: [{ admin: { $eq: username } }, { "freelancer.owner": { $eq: username } }, { "client.owner": { $eq: username } }] })
        //console.log(intouchDetails)
        const touch = []
        const sum = 0;
        const count =0;
        intouchDetails.forEach(async data => {
            if (data.role === "client") {
                const clientDetails = await GigPart.findById(data.client.id);
                data.details = clientDetails;
                //sum.push(data.details.price);
                touch.push(data);
            } else {
                const freelancerDetails = await ProjectPart.findById(data.freelancer.id);
                data.details = freelancerDetails;
                //sum.push(data.details.stipend)
                touch.push(data);
            }
        })
        const freelancerKaChatting = await FreelancerInTouch.find({
            admin: username
        })
        const freelancerKatouch = []
        freelancerKaChatting.forEach(async chat => {
            const freelancerKapDetails = await ProjectPart.findById(chat.name)
            chat.name = freelancerKapDetails
            freelancerKatouch.push(chat)
        })
        const postedProject = await ProjectPart.find({
            admin: username
        })
        const adminName = username;

        const Active = await ClientAgreement.find({ $or: [{ "inTouchCardDetails.admin": { $eq: username } },{ "inTouchCardDetails.client.owner": { $eq: username } }, { "inTouchCardDetails.freelancer.owner": { $eq: username } }] },)
        //console.log("Active",Active)
        const ActiveProjects = Active.map(async data => {
            // console.log(data.inTouchCardDetails.role)
            if (data.inTouchCardDetails.role === "freelancer") {
                const ProjectInfo = await ProjectPart.findById(data.inTouchCardDetails.freelancer.id)
                data.ProjectDetails = ProjectInfo;
                return data;
                //ActiveProjects.push(data);
            } else {
                const GigInfo = await GigPart.findById(data.inTouchCardDetails.client.id)
                data.GigDetails = GigInfo;
                return data;
            }
        })
        var ActiveProjectsData = await Promise.all(ActiveProjects);
        const walletData = await  GiveRating.find({ $or: [{ "freelancer": { $eq: username } }, { "admin": { $eq: username } }] },)
       
        res.render("sidebar", { gigs: prjct, edit: prfile, posted: postedProject, adminName, touch, ActiveProjectsData, sum,walletData ,count})
    } catch (err) {
        console.log(err)
    }
})
app.get("/freelancers", isLoggedIn, async (req, res) => {
    // console.log("Fetched")
    try {
        const prjct2 = await GigPart.find({})
        const gigs2 = prjct2;
        res.render("freelancers", { gigData: gigs2 })
        // console.log(gigData);

    } catch (err) {
        // console.log("not Fetched")
        // console.log(err)
    }
})
app.get("/Projects", isLoggedIn, async (req, res) => {
    const projects = await ProjectPart.find({})
    const intouchdetails = await InTouch.find({ admin: req.user.username });
    res.render("Projects", { projects: projects, intouchDetails: intouchdetails });
})

app.post("/signup", (req, res) => {
    if (req.body.password === req.body.confirmpassword) {
        const { username, email, _id, referralcode } = req.body
        var newUser = new Register({ username, email, _id, referralcode });
        Register.register(newUser, req.body.password, (err, user) => {
            if (err) {
                return res.redirect("/signup");
            }
            passport.authenticate("local")(req, res, () => {
                res.redirect("/Homepage2");
            });
        });
    }
    else {
        //  alert("Please enter all the details correctly")
        return res.redirect("/signup");
    }
});

app.post("/signin", passport.authenticate("local", {
    failureRedirect: "/signin"
}), (req, res) => {
    // console.log(req.user)
    res.redirect("/Homepage2")

});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/index");
})


app.post("/projectEdit", isLoggedIn, async (req, res) => {
    try {
        const inputEmployee = await new ProjectPart({
            companyName: req.body.companyName,
            positionAvailable: req.body.positionAvailable,
            startDate: req.body.startDate,
            applyBy: req.body.applyBy,
            duration: req.body.duration,
            workLocation: req.body.workLocation,
            stipend: req.body.stipend,
            projectType: req.body.projectType,
            companyLocation: req.body.companyLocation,
            skills: req.body.skills,
            openings: req.body.openings,
            weblink: req.body.weblink,
            jobTitle: req.body.jobTitle,
            workJD: req.body.workJD,
            // myimage: req.file.filename,
            admin: req.user.username
        })

        const registered = await inputEmployee.save();
        req.flash("success", "Project added succesfully");
        res.status(201).redirect("/Projects")
    } catch (error) {

        req.flash("error", "Something went wrong >.<");
        res.status(201).redirect("/projectEdit")
        // res.status(400).send(error);
    }
})

app.post("/sidebar", isLoggedIn, async (req, res) => {
    try {
        const updateDetails = await new EditProfile({
            fullName: req.body.fullName,
            about: req.body.about,
            headLine: req.body.headLine,
            email: req.body.email,
            mobile: req.body.mobile,
            address: req.body.address,
            profile: req.user._id
        })

        const registered = await updateDetails.save();
        //  console.log("new details are ", registered)
        res.status(201).redirect("/sidebar")
    } catch (error) {
        res.status(400).redirect("/index")
    }
})
app.post("/ProfileEdit", isLoggedIn, async (req, res) => {
    try {
        const updateDetails = await new EditProfile({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            headLine: req.body.headLine,
            email: req.body.email,
            mobile: req.body.mobile,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            skills: req.body.skills,
            gradDate: req.body.gradDate,
            admin: req.user.username
        })

        const registered = await updateDetails.save();
        // console.log("new details are ", registered)
        res.status(201).redirect("/sidebar")
    } catch (error) {
        res.status(400).send(error);
    }
})
app.post("/sidebar/ratings/:id", isLoggedIn, async (req, res) => {
    const ActiveProjectdata = await ClientAgreement.findById(req.params.id);
  //  console.log(ActiveProjectdata)
    if(ActiveProjectdata.inTouchCardDetails.role=='freelancer'){
    var freelancer1=ActiveProjectdata.inTouchCardDetails.admin;
    const ProjectData1 = await ProjectDetails.findById(ActiveProjectdata.inTouchCardDetails.freelancer.id)
    var amount = ProjectData1.stipend
    }else{
      var freelancer1 = ActiveProjectdata.inTouchCardDetails.client.owner;
      const GigData = await GigPart.findById(ActiveProjectdata.inTouchCardDetails.client.id)
      var amount = GigData.price
    }
    try {
        const updateDetails = await new GiveRating({
            rating: req.body.rating,
            admin: req.user.username,
            walletDetails : amount,
            freelancer : freelancer1,
            cardID: req.params.id,
            received: true
        })
      
        const registered = await updateDetails.save();
        res.status(201).redirect("/sidebar")
    } catch (error) {
        res.status(400).send(error);
    }
})
app.post("/sidebar/withdraw", isLoggedIn, async (req, res) => {
    try {
        const updateDetails = await new WithDrawMoney({
            amount: req.body.amount,

            admin: req.user.username
        })

        const registered = await updateDetails.save();
        // console.log("new details are ", registered)
        res.status(201).redirect("/sidebar")
    } catch (error) {
        res.status(400).send(error);
    }
})
app.post("/sidebar/bankDetails", isLoggedIn, async (req, res) => {
    try {
        const updateDetails = await new EditBankDetail({
            don: req.body.don,
            accNum: req.body.accNum,
            ifscCode: req.body.ifscCode,
            upiID: req.body.upiID,

            admin: req.user.username
        })

        const registered = await updateDetails.save();

        // console.log("new details are ", registered)
        res.status(201).redirect("/sidebar")
    } catch (error) {
        res.status(400).send(error);
    }
})
app.post("/sidebar/bankDetails", isLoggedIn, async (req, res) => {
    try {
        const updateDetails = await new FilterPart({
            date: req.body.date,
            stipend: req.body.stipend,
            duration: req.body.duration,
            position: req.body.position,
            long: req.body.long,
            short: req.body.short,

            admin: req.user.username
        })

        const registered = await updateDetails.save();

        // console.log("new details are ", registered)
        res.status(201).redirect("/sidebar")
    } catch (error) {
        res.status(400).send(error);
    }
})

app.put("/sidebar", async (req, res) => {
    try {
        const updateDetails = {
            fullName: req.body.fullName,
            about: req.body.about,
            headLine: req.body.headLine,
            email: req.body.email,
            mobile: req.body.mobile,
            address: req.body.address,
        }
        // EditProfile.findOne(profile)
        const newDetails = await EditProfile.findOneAndUpdate({ profile: req.user._id }, updateDetails, { new: true })
        // console.log(" updated are ", newDetails)
        res.status(201).redirect("/sidebar")
    } catch (error) {
        res.status(201).redirect("/sidebar")
    }
})


app.post("/GigEdit", isLoggedIn, upload, async (req, res) => {
    // console.log(req.body);
    try {
        const inputGig = new GigPart({
            gigTitle: req.body.gigTitle,
            describeGig: req.body.describeGig,
            subCategory: req.body.subCategory,
            price: req.body.price,
            gigCategory: req.body.gigCategory,
            image1: req.body.image1,
            image2: req.body.image2,
            image3: req.body.image3,
            image4: req.file.filename,
            admin: req.user.username
        })
        // console.log(inputGig)
        const registered = await inputGig.save();
        // console.log(registered)
        res.status(201).redirect("/sidebar")
    } catch (error) {
        res.status(400).send(error);
    }
})



app.get("/delete/:id", function (req, res, next) {
    var id = req.params.id;
    var del = ProjectPart.findByIdAndDelete(id);


    del.exec(function (err) {
        if (err) throw err;
        res.redirect("/sidebar")
    })

})
app.get("/delete2/:id", function (req, res, next) {
    var id = req.params.id;
    var del = GigPart.findByIdAndDelete(id);


    del.exec(function (err) {
        if (err) throw err;
        res.redirect("/sidebar")
    })

})
app.get("/delete3/:id", function (req, res, next) {
    var id = req.params.id;
    var del = EditProfile.findByIdAndDelete(id);


    del.exec(function (err) {
        if (err) throw err;
        res.redirect("/sidebar")
    })

})
app.get("/delete4/:id", function (req, res, next) {
    var id = req.params.id;
    var del = InTouch.findByIdAndDelete(id);


    del.exec(function (err) {
        if (err) throw err;
        res.redirect("/sidebar")
    })

})
app.get("/delete5/:id", function (req, res, next) {
    var id = req.params.id;
    var del = InTouch.findByIdAndDelete(id);


    del.exec(function (err) {
        if (err) throw err;
        res.redirect("/sidebar")
    })

})


app.get("/edit/:id", function (req, res, next) {
    var id = req.params.id;
    var edit = ProjectPart.findById(id);

    edit.exec(function (err, data) {
        if (err) throw err;
        res.render('edit', { records: data })
    })
})
app.get("/edit2/:id", function (req, res, next) {
    var id = req.params.id;
    var edit = GigPart.findById(id);

    edit.exec(function (err, data) {
        if (err) throw err;
        res.render('edit2', { record: data })
    })
})
app.get("/edit3/:id", function (req, res, next) {
    var id = req.params.id;
    var edit = EditProfile.findById(id);

    edit.exec(function (err, data) {
        if (err) throw err;
        res.render('edit3', { record3: data })
    })
})
app.get("/shortlist/:id", isLoggedIn, async (req, res) => {
    var id = req.params.id;
    var edit = await GigPart.findById(id);
    const intouchdetails = await InTouch.find({ $and: [{ "client.id": { $eq: req.params.id } }, { "client.owner": { $eq: req.user.username } }] })
    //console.log("client approach", intouchdetails)
    // console.log(edit);
    //edit.exec(function (err, data) {
    //  if (err) throw err;
    res.render('shortlist', { record4: edit, id, intouchdetails })

    // })
})
app.post("/shortlist/:id", isLoggedIn, async (req, res) => {
    try {
        const gigData = await GigPart.findById(req.params.id);
        const client = { id: req.params.id, owner: gigData.admin }
        const inputInTouch = new InTouch({
            client,
            userName: req.body.userName,
            admin: req.user.username,
            role: "client",
            applied: true
        })
        const registered = await inputInTouch.save();
        res.status(201).redirect("/sidebar")
    } catch (error) {
        res.status(400).send(error);
    }
})
app.post("/Projects/:id", isLoggedIn, async (req, res) => {
    try {
        const projectData = await ProjectPart.findById(req.params.id);
        const freelancer = { id: req.params.id, owner: projectData.admin }
        const freelancerKaTouch = new InTouch({
            freelancer,
            userName: req.body.userName,
            admin: req.user.username,
            role: 'freelancer',
            applied: true
        })
        //console.log("freelancer intouch details", freelancerKaTouch)
        const registered = await freelancerKaTouch.save();
        res.status(201).redirect("/sidebar")
    } catch (error) {
        res.status(400).send(error);
    }
})
app.post("/contact",  async (req, res) => {
    try {
        const updateDetails = await new ContactPart({
            name: req.body.name,
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message,
           
        })

        const registered = await updateDetails.save();
        
        res.status(201).redirect("/contact")
    } catch (error) {
        res.status(400).redirect("/index")
    }
})
app.post("/sidebar/intouch/:id", isLoggedIn, async (req, res) => {
    try {
        const intouchCardDetails = await inTouch.findById(req.params.id);
        const ActiveProjectInfo = new ClientAgreement({
            inTouchCardDetails: intouchCardDetails,
            confirmed : true
        })
        
        const registered = await ActiveProjectInfo.save();
        res.status(201).redirect("/payment")
    } catch (error) {
        res.status(400).send(error);
        console.log(error)
    }
})
app.post("/update/", upload, function (req, res, next) {

    var update = ProjectPart.findByIdAndUpdate(req.body.id, {
        companyName: req.body.companyName,
        startDate: req.body.startDate,
        applyBy: req.body.applyBy,
        duration: req.body.duration,
        stipend: req.body.stipend,
        skills: req.body.skills,
        openings: req.body.openings,
        weblink: req.body.weblink,
        jobTitle: req.body.jobTitle,
        workJD: req.body.workJD,
        myimage: req.file.filename
    });

    update.exec(function (err, data) {
        if (err) throw err;
        res.redirect("/Projects")
    })
})
app.post("/update2/", upload, function (req, res, next) {

    var update = GigPart.findByIdAndUpdate(req.body.id, {
        gigTitle: req.body.gigTitle,
        describeGig: req.body.describeGig,
        subCategory: req.body.subCategory,
        price: req.body.price,
        gigCategory: req.body.gigCategory,
        // image1: req.body.image1,
        // image2: req.body.image2,
        // image3: req.body.image3,
        //image4: req.file.filename
    });

    update.exec(function (err, data) {
        if (err) throw err;
        res.redirect("/freelancers")
    })
})
app.post("/update3/", function (req, res, next) {

    var update = EditProfile.findByIdAndUpdate(req.body.id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        headLine: req.body.headLine,
        email: req.body.email,
        mobile: req.body.mobile,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        skills: req.body.skills,
        gradDate: req.body.gradDate,

    });

    update.exec(function (err, data) {
        if (err) throw err;
        res.redirect("/sidebar")
    })
})

server.listen(port, () => {
    console.log(`server is running at port no ${port}`)
})