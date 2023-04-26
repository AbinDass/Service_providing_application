import bcrypt from "bcrypt";
import userdb from "../../model/user.js";
const adminLogin = (req, res) => {
    try {
        res.status(200).json({ admin: "success" });
    } catch (error) {
        res.status(500).json({ error: "internal server error" });
    }
};

const postAdmin = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;
        const admin = await userdb.findOne({ email: email });
        console.log(admin, "admin here");
        if (admin) {
            console.log(admin);
            bcrypt.compare(password, admin.password, (err, data) => {
                if (data) {
                    if (admin.isAdmin === true) {
                        console.log("iam here");
                        res.status(200).json({ admin: true });
                    }
                }
            });
        } else {
            res.json({ admin: false });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server  error" });
    }
};

export { adminLogin, postAdmin };
