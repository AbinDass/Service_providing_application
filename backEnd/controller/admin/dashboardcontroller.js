//get dash board
import User from "../../model/user.js";
import Servicedb from "../../model/service.js";
import subscribedb from "../../model/subscription.js";
import workerdb from "../../model/worker.js";

const dashBoard = (req, res) => {
    try {
        res.status(200).json({
            getdashboard: true,
        });
    } catch (err) {
        res.status(500).json({ error: "internal server error" });
    }
};

const userList = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            getuserlist: true,
            userdata: users,
        });
    } catch (err) {
        res.status(500).json({ error: "internal server error" });
    }
};

const workerList = async (req, res) => {
    try {
        const workers = await workerdb.find().populate('user')
        res.status(200).json(workers)
    } catch (error) {
        res.status(500).json({error:" internal server error "})
    }
};
const dashBoarduserList = async (req, res) => {
    try {
       
       const saleReport = await User.aggregate([
           
            {
                $group: {
                    _id: { $dateToString: { format: "%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ])
       const result =  saleReport.map((report)=>{
           const month = getMonthName(report._id)
           report.month = month
           return report
        })
 
        res.status(200).json(result);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "internal server error" });
    }
};

export const ProfitData = async (req, res) => {
    try {
        console.log('object')
        const profit = await workerdb.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%m", date: "$createdAt" } },
                    profit_count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ])
        const result =  profit.map((report)=>{
            const month = getMonthName(report._id)
            report.month = month
            return report
        })
        console.log(result)
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error:"internal server error" });
    }
};

//block and unblock users
const blockUser = async (req, res) => {
    try {
        console.log("iam herer ibadeeeee");
        const userid = req.body.userId;
        console.log(req.body);
        console.log(userid, "id aanu");
        const user = await User.findById(userid);
        console.log(user);
        if (user && user.access == true) {
            console.log("object");
            const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { access: false }, { new: true });
            console.log(updatedUser, "ith updted");
            await updatedUser.save();
            res.status(200).json({
                blockuser: true,
            });
        } else {
            res.status(404).json({
                blockuser: false,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "internal server error" });
    }
};

const unblockUser = async (req, res) => {
    try {
        const userid = req.body.userId;
        const user = await User.findById(userid);
        console.log(user, "usser");
        if (user && user.access == false) {
            const updatedUser = await User.findOneAndUpdate(user._id, { access: true }, { new: true });
            await updatedUser.save();
            res.status(200).json({
                unblockuser: true,
                updatedUser,
            });
        } else {
            res.status(404).json({
                unblockuser: false,
            });
        }
    } catch (err) {
        res.status(500).json({ error: "internal server error" });
    }
};

//add services for workers

const addService = (req, res) => {
    try {
        console.log(req.body);
        const { service, description, image,logo } = req.body;
        console.log(image, "ith image");
        const newservice = new Servicedb({
            title: service,
            description,
            thumbnail: image,
            servicelogo: logo,
        });
        newservice.save();
        res.status(201).json({
            newservice,
        });
    } catch (err) {
        res.status(500).json({ error: "internal server error" });
    }
};

const deleteService = async (req, res) => {
    try {
        console.log("object");
        console.log(req.params.id);
        const serviceid = req.params.id;
        const service = await Servicedb.findByIdAndUpdate({ _id: serviceid }, { isdeleted: true }, { new: true });
        console.log(service);
        res.status(200).json(service);
    } catch (err) {
        res.status(500).json({ error: "internal server error" });
    }
};




 const getMonthName = (monthNumber) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return months[monthNumber - 1]
}


export { dashBoard, userList, blockUser, unblockUser, addService, deleteService ,dashBoarduserList,workerList };
