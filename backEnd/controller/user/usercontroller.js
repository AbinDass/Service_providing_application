import userdb from "../../model/user.js";
// get user
export const User = async (req, res) => {
    try {
        const id = req.query.userid;
        const user = await userdb.findOne({ _id: id });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ err: `internal error` });
    }
};

export const editProfile = async (req, res) => {
    try {
        console.log(req.body, "itho");
        const image = req.body.imageurl;
        console.log(image);
        const { firstname, secondname, phone, location, decleration, distric, state } = req.body.userdata;
        const userid = req.body.userId;
        const user = await userdb.findOne({ _id: userid });
        console.log(user);
        if (!user) {
            res.status(404).json({ err: `something went wrong` });
        } else {
            const updatedUser = await userdb.findByIdAndUpdate(
                userid,
                {
                    $set: {
                        firstname: firstname,
                        secondname: secondname,
                        phone: phone,
                        location: location,
                        decleration: decleration,
                        distric: distric,
                        state: state,
                        profilepicture: image,
                    },
                },
                { new: true }
            );

            console.log(updatedUser, "iam");
            res.status(201).json(updatedUser);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: `internal error` });
    }
};
