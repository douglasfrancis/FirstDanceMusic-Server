const router = require("express").Router();
const Service = require("../models/serviceModel");
const shuffle = require('lodash.shuffle');
const nodeoutlook = require('nodejs-nodemailer-outlook');


router.get("/", async (req, res) => {

        await Service.find()
            .then(service => {
               return res.json(shuffle(service))})
            .catch(err => res.status(400).json('Error: ' + err));
   
});

router.get("/:id", async (req, res) => {

    await Service.findById(req.params.id)
        .then(
            response => 
            {return res.json(response)}
            
            )
        .catch(err => res.status(400).json('Error: ' + err));

});

router.post("/filter", async (req, res) => {
   
    if(!req.body.service || !req.body.location) {
        return res.status(400).json({msg: "Please provide both service and location"})
    } else {

    

   await Service.find({location: req.body.location, service: req.body.service})
        .then(profiles=> {
           return res.json(profiles)})
        .catch(err => res.status(400).json('Error: ' + err));
    }

});

router.post("/", async (req, res) => {

    const {name, email, number, date, venue, artistName, service, sets, quote} = req.body;

    if(!name || !email || !number || !date || !venue) {
        return res.status(400).json({msg: "Please enter all fields"})
    }; 

    nodeoutlook.sendEmail({
        auth: {
            user: process.env.OUTLOOK_EMAIL,
            pass: process.env.OUTLOOK_PASSWORD
        },
        from: "First Dance Music <doug@musicgofer.co.uk>",
        to: 'dougiefrancis@gmail.com',
        subject: 'FDM - New Booking Request',
        text: `We have received a new booking with the following details;

        Bride Name is ${name}
        Bride Email: ${email}
        Bride Number is ${number}
        Wedding Date is ${date}
        Wedding Venue is ${venue}

        Artist Name is ${artistName}
        Service is ${service}
        Number of sets is ${sets}
        The quote given was £${quote}
        Artist will get paid £${(quote/115)*100}
        `,
        
    
        onError: (e) => {
            console.log(e),
        res.status(500).json({msg: "We're sorry something has gone wrong. Please contact us directly at niel@musicgofer.co.uk"})},

        onSuccess: (i) => {
            console.log(i);
            res.json({msg: "Message Sent Successfully!"})}
    }
     
    );

});

module.exports = router;