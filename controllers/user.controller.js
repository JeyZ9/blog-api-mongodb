const bcrypt = require("bcrypt");
const UserModel = require("../models/User.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    const { username, password } = req.body;

    if(!username || !password){
        return res.status(400).send({
            message: "Please provide username and password."
        })
    }

    const existingUser = await UserModel.findOne({username});
    if(existingUser){
        return res.status(400).send({
          message: "Username is already used.",
        });
    }

    try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword =  bcrypt.hashSync(password, salt);
        const user = await UserModel.create({
            username,
            password: hashedPassword
        })

        res.send({
            message: "User registered successfully."
        })
    }catch(e) {
        res.status(500).send({
            message: e.message || "Something occurred while registering a new user"
        })
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({
        message: "Username or password are missing, please provide all fields.",
      });
    }
    try{
        const userDoc = await UserModel.findOne({username});
        if(!userDoc){
            return res.status(404).send({
                message: "User not found.",
            });
        }
        const isPasswordMatched = await bcrypt.compare(password, userDoc.password);

        if(!isPasswordMatched) {
            return res.status(401).send({
              message: "Invalid credentials.",
            });
        }

        jwt.sign({username, id: userDoc._id}, JWT_SECRET, {}, (err, token) => {
            if(err){
                return res.status(500).send({message: "Internal Serve Error: Authentication failed!" || e.message})
            }

            return res.send({
                message: "Logged in successfully", accessToken: token
            })
        })

    }catch(e) {
        res.status(500).send({
          message:
            e.message || "Something occurred while registering a new user",
        });
    }
}