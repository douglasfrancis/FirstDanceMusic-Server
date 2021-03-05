const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());


app.listen(5000, () => 
    console.log("Server running on port 5000")
);

//set up Routers

app.use("/service", require("./routers/serviceRouter"));

//connect to MongoDB

mongoose.connect(process.env.MONGO_DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (err) return console.error(err);
    console.log("Connected to MongoDB")
});