// const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken";
// const User = require("../model/user");
import User from "../model/user.js";
// const { promisify } = require("util");
import { promisify } from "util";


export const verifyToken = async (req, res, next) => {
    try {
        let token = req.headers["authorization"]
        console.log(token , 9999999)
        console.log('oooo')
        console.log(process.env.JWT_SECRET_KEY, "object")
        
        
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
            if (err) {
      // Handle verification error
      console.error(err,'llllllllllll');
      res.sendStatus(401);
    } else {
        // Token verified successfully
        console.log(decodedToken,'pppp');
        next();
        // res.sendStatus(200);

    }
});

}catch(err){
    console.log(err)
}
}


// if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//     token = req.headers.authorization.split(" ")[1];
//     console.log(token, "mil kaye");
// } else if (req.cookies.jwt) {
//     token = req.cookies.jwt;
// }
// if (!token) {
//     res.status(401).json({ err: `You aren't logged in,please loggin to get access!` });
//     return;
// }
  
  
    //     const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
    //     console.log(decode, "decode");

    //     const freshUser = await User.findById(decode.id);

    //     if (!freshUser && freshUser.access != true) {
    //         res.status(401).json({ err: "The user belonging to this token does no longer exist!" });
    //         return;
    //     }
    //     req.user = freshUser;
    //     next();
    // } catch (e) {
    //     if (e.name === "JsonWebTokenError") {
    //         res.status(401).json({ err: "Invalid Token Plese Login Again!" });
    //         return;
    //     }
    //     if (e.name === "TokenExpiredError") {
    //         res.status(401).json({ err: "Your Token Has Expired , Plese Login Again!" });
    //         return;
    //     }
    // }


// export default verifyToken
