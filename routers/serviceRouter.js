const router = require("express").Router();
const Service = require("../models/serviceModel");
const auth = require("../middleware/auth");


router.get("/", auth, async (req, res) => {

    try{
        
        const services = await Service.find({user: req.user});
        res.json(services);

    } catch (err) {
        res.status(500).send();
    }
   
});

router.post("/", auth, async (req, res) => {
    try{

    const {name, location, service, price, link} = req.body;

    //validation

    if(!service || !location || !link || !name || !price) {
        return res.status(400).json({msg: "Please provide all fields"})
    }
    
    const newService = new Service({
        name, 
        location,
        service, 
        price,
        link,
        user: req.user

    })

    const savedService = await newService.save();

    res.json(savedService);
} catch (err) {
    res.status(500).send();
}
});

router.put("/:id", auth, async (req, res) => {
    try{

        
        const { name, location, service, price, link} = req.body;
        const serviceId = req.params.id;

        //validation
        if(!service || !location || !link || !name || !price) {
            return res.status(400).json({msg: "Please fill in all fields"})
        };

        if(!serviceId)
            return res.status(400).json({msg: "Please contact the developer"});
        
        const originalService = await Service.findById(serviceId);
        if(!originalService)
            return res.status(400).json({msg: "Please contact the developer"});


        if(originalService.user.toString() !== req.user)
            return res.status(401).json({msg: "unauthorised"});

       originalService.name = name;
       originalService.location = location;
       originalService.service = service;
       originalService.price = price;
       originalService.link = link;

       const savedService = await originalService.save();

       res.json(savedService);
    } catch (err) {
        res.status(500).send();
    }
})



router.delete("/:id", auth, async (req, res) => {
    try{
        const serviceId = req.params.id;

        //validation
        if(!serviceId)
            return res.status(400).json({msg: "Please contact the developer"});
        
        const existingService = await Service.findById(serviceId);
        if(!existingService)
            return res.status(400).json({msg: "Please contact the developer"});

        if(existingService.user.toString() !== req.user)
            return res.status(401).json({msg: "unauthorised"});

        await existingService.delete();

        res.json(existingService);

    } catch (err) {
        res.status(500).send();
    }
})

module.exports = router;