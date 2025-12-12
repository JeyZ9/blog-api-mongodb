const bcrypt = require("bcrypt");
const UserModel = require("../models/User.js")
const salt = bcrypt.genSaltSync(10);

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
        const hashedPassword =  bcrypt.hashSync(password, salt);
        const user = await UserModel.create({
            username,
            hashedPassword
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