const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000", "https://firstdancemusic.netlify.app" ], 
    credentials: true
}));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
    console.log(`Server running on port ${PORT}`)
);

//set up Routers

app.use("/service", require("./routers/serviceRouter"));
app.use("/auth", require("./routers/userRouter"));
app.use("/search", require("./routers/searchRouter"));

//connect to MongoDB

mongoose.connect(process.env.MONGO_DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (err) return console.error(err);
    console.log("Connected to MongoDB")
});