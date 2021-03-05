const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    name: {type:String},
    service : {type: String},
    link: {type: String}
}, {
    timestamps: true
});

const Service = mongoose.model("service", serviceSchema);

module.exports = Service;