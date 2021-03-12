const router = require("express").Router();
const Service = require("../models/serviceModel");
const shuffle = require('lodash.shuffle');


router.get("/", async (req, res) => {

        await Service.find()
            .then(service => res.json(shuffle(service)))
            .catch(err => res.status(400).json('Error: ' + err));
   
});

router.get("/:id", async (req, res) => {

    await Service.find({_id: req.params.id})
        .then(
            profile => 
            {return res.json(profile)}
            
            )
        .catch(err => res.status(400).json('Error: ' + err));

});

router.post("/filter", async (req, res) => {
   
    if(!req.body.service || !req.body.location) {
        return res.status(400).json({msg: "Please provide both service and location"})
    }

   await Service.find({location: req.body.location, service: req.body.service})
        .then(profiles=> res.json(profiles))
        .catch(err => res.status(400).json('Error: ' + err));

});

module.exports = router;