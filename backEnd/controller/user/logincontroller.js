import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { get } from "mongoose";

const signuptoken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1hr",
    });
};

import userdb from "../../model/user.js";

const Login = (req, res) => {
    try {
        res.json({ signin: true });
    } catch (error) {
        res.status(500).json({ error: "internal server error" });
    }
};

const postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userdb.findOne({ email: email });
        if (user) {
            const data = await bcrypt.compare(password, user.password);
            if (data) {
                let token = signuptoken(user._id);
                res.status(200).json({ user, token });
                console.log(token)
            }
        } else {
            res.status(200).json({ user: false });
        }
    } catch (error) {
        res.status(500).json({ error: "internal server error" });
    }
};

//user signup
const signup = (req, res) => {
    try {
        res.json({ signup: true });
    } catch (error) {
        res.status(500).json({ error: "internal server error" });
    }
};

const postSignup = async (req, res) => {
    try {
        const { email, password, confirmpassword } = req.body;
        const newUser = await userdb.findOne({ email: email });
        

        if (!newUser && password === confirmpassword) {
            const { firstname, secondname, email, phone, password,location,distric,state } = req.body;
            console.log(req.body)
            const hashedpassword = await bcrypt.hash(password, 10);
            const userdata = new userdb({
                firstname,
                secondname,
                email,
                phone,
                password: hashedpassword,
                location: location,
                distric: distric,
                state: state,
            });
            console.log('object')
            console.log(userdata)
            let token;
            userdata.save().then((data) => {
                token = signuptoken(data._id);
                res.status(200).json({userdata, success: true, token });
            });
            return;
        } else {
            res.json({ user: "exist" });
        }
    } catch (error) {
        res.status(500).json({ error: "internal server error" });
    }
};

const googleAuth = async (req, res) => {
    try {
        const { email } = req.body.datas.data.email;
        const user = await userdb.findOne({ email: email });
        if (user) {
            const token = signuptoken();
            res.status(200).json({ user: user, success: true, token });
        } else {
            const { given_name, family_name, email } = req.body.datas.data;
            const newUser = new userdb({
                firstname: given_name,
                secondname: family_name,
                email: email,
            });
            newUser.save();
            res.status(201).json({ user: newUser, success: true });
        }
    } catch (err) {
        res.status(500).json({ error: "internal server error" });
    }
};
export { Login, postLogin, signup, postSignup, googleAuth };
