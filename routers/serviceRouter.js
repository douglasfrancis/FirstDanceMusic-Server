const router = require("express").Router();
const Service = require("../models/serviceModel");


router.get("/", async (req, res) => {
    const services = await Service.find();
    res.json(services);
});

router.post("/", async (req, res) => {
    try{

    const {name, service, link} = req.body;

    //validation

    if(!service || !link) {
        return res.status(400).json({msg: "Please provide the service you would like to add with relevant link"})
    }
    
    const newService = new Service({
        name, service, link
    })

    const savedService = await newService.save();

    res.json(savedService);
} catch (err) {
    res.status(500).send();
}
});

router.put("/:id", async (req, res) => {
    try{
        const { name, service, link} = req.body;
        const serviceId = req.params.id;

        //validation
        if(!service || !link) {
            return res.status(400).json({msg: "Please provide the service you would like to add with relevant link"})
        };

        if(!serviceId)
            return res.status(400).json({msg: "Please contact the developer"});
        
        const originalService = await Service.findById(serviceId);
        if(!originalService)
            return res.status(400).json({msg: "Please contact the developer"});

       originalService.name = name;
       originalService.service = service;
       originalService.link = link;

       const savedService = await originalService.save();

       res.json(savedService);
    } catch (err) {
        res.status(500).send();
    }
})


router.delete("/:id", async (req, res) => {
    try{
        const serviceId = req.params.id;

        //validation
        if(!serviceId)
            return res.status(400).json({msg: "Please contact the developer"});
        
        const existingService = await Service.findById(serviceId);
        if(!existingService)
            return res.status(400).json({msg: "Please contact the developer"});

        await existingService.delete();

        res.json(existingService);

    } catch (err) {
        res.status(500).send();
    }
})

module.exports = router;