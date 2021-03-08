const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const serviceSchema = new mongoose.Schema({
    name: {type:String},
    location: {type:String},
    service : {type: String},
    link: {type: String},
    price: {type: Number},
    user: {type: ObjectId, required: true}
}, {
    timestamps: true
});

const Service = mongoose.model("service", serviceSchema);

module.exports = Service;