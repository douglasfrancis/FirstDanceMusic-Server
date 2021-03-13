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

    const email = {
        name: req.body.name
    };

    nodeoutlook.sendEmail({
        auth: {
            user: process.env.OUTLOOK_EMAIL,
            pass: process.env.OUTLOOK_PASSWORD
        },
        from: 'doug@musicgofer.co.uk',
        to: 'dougiefrancis@gmail.com',
        subject: 'FDM - New Booking Request',
        text: `Name is ${email.name}`,
        replyTo: 'test@gmail.com',
        
        onError: (e) => console.log(e),
        onSuccess: (i) => {
            console.log(i);
            res.send("Message Sent Successfully!")}
    }
     
    );

});

module.exports = router;