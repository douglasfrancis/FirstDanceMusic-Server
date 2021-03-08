const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

router.post("/", async (req, res) => {
    try{
        const {email, password, passwordVerify} = req.body;

        //validation
        if(!email || !password || !passwordVerify) {
            return res.status(400).json({msg: "Please enter all required fields"})
        };

        if(password.length < 6) {
            return res.status(400).json({msg: "Please enter a password with at least 6 characters"})
        };

        if(password !== passwordVerify){
            return res.status(400).json({msg: "Please make sure your passwords match"})
        }

        //ensure no existing account
        const existingUser = await User.findOne({email: email})
        if(existingUser){
            return res.status(400).json({msg: "An account with this email already exists."})
        };

        //hash password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

       //save user to DB
       const newUser = new User({
           email,
           passwordHash
       });
       const savedUser = await newUser.save();

       //Create JWT token
       const token = JWT.sign({
        id: savedUser._id
       }, process.env.JWT_SECRET);

       res.cookie("token", token, {httpOnly: true}).send();

    } catch (err) {
        res.status(500).send();
    }
});

router.post("/login", async (req, res) => {
    try{
        const {email, password} = req.body;

        //validation
        if(!email || !password ) {
            return res.status(400).json({msg: "Please enter all required fields"})
        };

        //get user account


        //ensure no existing account
        const existingUser = await User.findOne({email: email})
        if(!existingUser){
            return res.status(401).json({msg: "Wrong email or password"})
        };

        const correctPassword = await bcrypt.compare(password, existingUser.passwordHash);

        if(!correctPassword)
            return res.status(401).json({msg: "Wrong email or password"})

       //Create JWT token
       const token = JWT.sign({
        id: existingUser._id
       }, process.env.JWT_SECRET);

       res.cookie("token", token, {httpOnly: true}).send();

    } catch (err) {
        res.status(500).send();
    }
});

router.get("/loggedIn", (req, res) => {
    try{
        const token = req.cookies.token

        if(!token) return res.json(null);

        const validatedUser = JWT.verify(token, process.env.JWT_SECRET);
       res.json(validatedUser.id)

        next();
    } catch (err){
        return res.json(null);
    }
});

router.get("/logOut", (req, res) => {
    try{
        res.clearCookie("token").send();

    } catch (err){
        return res.json(null);
    }
});

module.exports = router;