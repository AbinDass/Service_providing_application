import Servicedb from "../../model/service.js";
import subscriptiondb from "../../model/subscription.js";
import workerdb from "../../model/worker.js";
import userdb from "../../model/user.js";
import appointmentdb from "../../model/appointment.js";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import sha256 from "crypto";
import crypto from "crypto";

import { verify } from "jsonwebtoken";

//get all services
export const getServices = async (req, res) => {
    try {
        
        const services = await Servicedb.find({ isdeleted: false });
        res.status(200).json({
            getservices: true,
            services,
        });
    } catch (err) {
        res.status(500).json({ error: "internal server error" });
    }
};

export const addSubscription = async (req, res) => {
    try {
        const { mainHead, subHead, plan, price, description, background } = req.body.Data;
        const newSubscribePlan = new subscriptiondb({
            mainHead,
            subHead,
            plan,
            price,
            description,
            background,
        });
        newSubscribePlan.save();
        res.status(200).json({ message: "good" });
    } catch (err) {
        res.status(500).json({ error: "internal server error" });
    }
};

export const getSubscriptions = async (req, res) => {
    try {
        const plans = await subscriptiondb.find();
        res.status(200).json({ plans });
    } catch (err) {
        res.status(500).json({ error: "internal server error" });
    }
};

export const takeSubscription = async (req, res) => {
    try {
        const subid = req.body.subId;
        const userid = req.body.userId;
        const subscription = await subscriptiondb.findOne({ _id: subid });
        const useris = await subscriptiondb.findOne({ users: { $elemMatch: { userid: userid } } });
        if (!useris) {
            // razorpay instance
            var instance = new Razorpay({
                key_id: process.env.razor_key_id,
                key_secret: process.env.razor_key_secret,
            });

            instance.orders.create(
                {
                    amount: subscription.price * 100,
                    currency: "INR",
                    receipt: subid,
                },
                (err, data) => {
                    let response = {
                        id: data.id,
                        razorpay: true,
                        subscibtiondata: data,
                    };

                    res.json({ response });
                }
            );
        } else {
            res.json({ message: "already has a subscription" });
        }
    } catch (err) {
        res.status(500).json({ error: "internal server error" });
    }
};
//verify and generate razorpay instance
async function verifyRazorpayPayment(paymentId, orderId, razorpaySignature) {
    try {
        const generatedSignature = generateRazorpaySignature(paymentId, orderId);
        const isSignatureValid = validateRazorpaySignature(generatedSignature, razorpaySignature);
        if (isSignatureValid) {
            return true;
        }

        return false; // Payment is invalid
    } catch (error) {
        return false; // Payment verification failed
    }
}

// Generate the Razorpay signature
function generateRazorpaySignature(paymentId, orderId) {
    const hmac = crypto.createHmac("sha256", process.env.razor_key_secret);
    hmac.update(`${orderId}|${paymentId}`);
    return hmac.digest("hex");
}

// Validate the Razorpay signature
function validateRazorpaySignature(generatedSignature, razorpaySignature) {
    return generatedSignature === razorpaySignature;
}

export const verifyPayment = async (req, res) => {
    try {
        const paymentId = req.body.razorpay_payment_id;
        const orderId = req.body.razorpay_order_id;
        const razorpaySignature = req.body.razorpay_signature;
        const subid = req.body.subId;
        const userid = mongoose.Types.ObjectId(req.body.userId);

        const useris = await subscriptiondb.findOne({ users: { $elemMatch: { userid: userid } } });
        if (!useris) {
            verifyRazorpayPayment(paymentId, orderId, razorpaySignature).then(async (isValid) => {
                
                function calculateExpiryDate(startDate, monthsUntilExpiry) {
                    const expiryDate = new Date(startDate.getTime()
                     +
                    (monthsUntilExpiry * 30 * 24 * 60 * 60 * 1000));
                    return expiryDate;
                  }

                if (isValid) {
                    const fromdate = new Date();
                    let period
                    const subscriptionIs = await subscriptiondb.findOne({_id: subid})
                    console.log(subscriptionIs.price)
                    if(subscriptionIs.price === 799){
                        period = 12
                    }else if (subscriptionIs.price === 499){
                        period = 6
                    }else{
                        period = 3
                    }
                    const enddate = calculateExpiryDate(fromdate, period);
                    
                    console.log(period)
                    const newSubscription = await subscriptiondb.updateOne(
                        { _id: subid },
                        {
                            $push: {
                                users: {
                                    userid: userid,
                                    subscriptionStatus: "completed",
                                },
                            },
                        }
                    );
                    const user = await userdb.findOneAndUpdate(
                        { _id: userid },
                        { role: "worker", subscriptiondate: fromdate, subscriptionexpirydate: enddate }
                    );
                    res.status(200).json({ payment: isValid, sub: newSubscription });
                } else {
                    res.status(401).json({ payment: !isValid });
                }
            });
        } else {
            res.status(401).json({ message: "user already have the subscription plan" });
        }
    } catch (error) {
        res.status(500).json({ error: "internal server error" });
    }
};

export const addServiceByuser = async (req, res) => {
    try {

        const { servicetitle, labour, location, distric, state, description, id } = req.body.formdata;
        // const userid = mongoose.Types.ObjectId(req.body.id);
        const image = req.body.imageurl;
        const useris = await workerdb.findOne({ user: id });
        if (!useris) {
            const newService = new workerdb({
                servicetitle: servicetitle,
                user: id,
                labour: labour,
                location: location,
                distric: distric,
                state: state,
                description: description,
                liecence: image,
            });
            newService.save();
            res.status(200).json(newService);
        } else {
            res.status(200).json({ message: "already you are added the service" });
        }
    } catch (err) {
        res.status(200).json({ err: "internal server errror" });
    }
};

export const getWorkerList = async (req, res) => {
    try {
        const title = req.query.title;
        const district = req.query.district;
        console.log(district,'----')
        const workers = await workerdb.find({ servicetitle: title , distric:district}).populate("user").sort({ createdAt: -1 });
        console.log(workers)
        res.status(200).json(workers);
    } catch (err) {
        res.status(500).json({ err: "internal server" });
    }
};

export const requestService = async (req, res) => {
    try {
        const { fromId, toId } = req.body;
        const user = await userdb.findOne({ _id: toId });
        const checkUser = user.requests.find((item) => item.requstedUserId == fromId);
        if (!checkUser) {
            userdb
                .findOneAndUpdate(
                    { _id: toId },
                    {
                        $push: {
                            requests: {
                                requstedUserId: fromId,
                            },
                        },
                    },
                    { new: true }
                )
                .then((response) => {
                    res.status(200).json(response);
                });
        } else {
        }
    } catch (error) {
        res.status(500).json({ err: "internal server error" });
    }
};

export const requestStatus = async (req, res) => {
    try {
        const requestedUser = await userdb.findOne({ _id: req.query.to });
        const getUser = requestedUser.requests.find((item) => item.requstedUserId == req.query.from);
        let status;
        if (!getUser) {
            status = "noRequests";
        } else {
            if (getUser.requestStatus === false) {
                status = "pending";
            } else {
                status = "accepted";
            }
        }
        res.status(200).json(status);
    } catch (error) {
        res.status(500).json({ err: "internal server error" });
    }
};

export const getAllrequests = async (req, res) => {
    try {
        const { userid } = req.query;
        const user = await userdb.findOne({ _id: userid }).populate("requests.requstedUserId");
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ err: "inernol server error" });
    }
};

export const acceptRequest = async (req, res) => {
    try {
        const requestId = mongoose.Types.ObjectId(req.query.id);
        // const user = await userdb.findOneAndUpdate(
        //     { requests: { $elemMatch: { "requests._id": id } } },
        //     { $set: { "requests.$.requestStatus": true } },
        //     { new: true }
        // );
        //     console.log(user)

        const user = await userdb.updateOne(
            { _id: req.query.userid, "requests._id": requestId },
            { $set: { "requests.$.requestStatus": true } },
            { new: true }
        );
        let requestStatus;
        if (user) requestStatus === true;
        else requestStatus = false;
        res.status(200).json({ user, requestStatus });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "internal server error" });
    }
};

export const cancelRequest = async (req, res) => {
    try {
        const { fromid, toid } = req.query;

        // const user = await userdb.findOne({ _id: toid});
        const cancelledRequset = await userdb.findByIdAndUpdate(
            { _id: toid },
            { $pull: { requests: { requstedUserId: fromid } } },
            { new: true }
        );
        res.status(200).json(cancelledRequset);
    } catch (error) {
        res.status(500).json({ error: "internal server error" });
    }
};

export const rejectRequest = async (req, res) => {
    try {
        const { fromid, userid } = req.query;
        const rejectRequest = await userdb.findByIdAndUpdate(
            { _id: userid },
            { $pull: { requests: { _id: fromid } } },
            { new: true }
        );
        res.status(200).json(rejectRequest);
    } catch (error) {}
};

export const getAcceptStatus = async (req, res) => {
    try {
        const id = mongoose.Types.ObjectId(req.query.id);
        const user = await userdb.findOne({ requests: { $elemMatch: { "requests._id": id } } });
        const requestStatus = user.requests[0].requestStatus;
        res.status(200).json({ user, requestStatus });
    } catch (error) {
        res.status(500).json({ error: "internal server error" });
    }
};

export const checkServiceAdded = async (req, res) => {
    try {
        const { userId } = req.query;
        const userAdded = await workerdb.findOne({ user: userId });

        if (userAdded) {
            res.status(200).json({ success: true });
        } else {
            res.status(200).json({ success: false });
        }
    } catch (error) {
        res.status(500).json({ error: "inernal server error" });
    }
};

export const checkSubscriptionIstrue = async (req, res) => {
    try {
        const { userId } = req.query;
        const userSubscribed = await subscriptiondb.findOne({ "users.userid": userId });
        if (userSubscribed) {
            res.status(200).json({ success: true });
        } else {
            res.status(200).json({ success: false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "internal server error" });
    }
};

//search services based on service title
export const SearchServiceTitle = async (req, res) => {
    const { userId } = req.query;
    const title = new RegExp(req.query?.title, "i");
    const district = req.query.ditsrict;
    if(userId=== 'undefined') {
        const search_result = await workerdb.find({ servicetitle: title });
        res.status(200).json(search_result);
    }else if (req.query.title !== "") {
        try {
            const user = await userdb.findOne({ _id: userId });
            const search_result = await workerdb.find({ servicetitle: title, distric: district });
            res.status(200).json(search_result);
        } catch (error) {
            res.status(500).json({ error: "no service matched" });
        }
    } else {
        res.status(200).json({ message: "empty" });
    }
};

export const getdistrict = async (req, res) => {
    try {
        const districts = await workerdb.distinct("distric");
        res.status(200).json(districts);
    } catch (error) {
        res.status(200).json({ error: "internal error" });
    }
};

export const getMyservice = async (req, res) => {
    try {
        const { id } = req.params;
        const myservice = await workerdb.findOne({ user: id }).populate("user");
        res.status(200).json(myservice);
    } catch (err) {
        res.status(500).json({ error: "internal server error" });
    }
};

export const makeAppointment = async (req, res) => {
    try {
        const { worker, user, date, time, desc } = req.body;
        const appointment = new appointmentdb({
            user: user,
            worker: worker,
            date: date,
            time: time,
            descreption: desc,
        });
        appointment.save();
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ error: "internal server error" });
    }
};

export const getAppointment = async (req, res) => {
    try {
        const { id } = req.query;
        const myAppointments = await appointmentdb.find({ worker: id }).populate("user");
        res.status(200).json(myAppointments);
    } catch (error) {
        res.status(500).json({ error: "internal server error" });
    }
};

export const updateAppointment = async (req, res) => {
    const { id, button } = req.query;
    try {
        const appointid = mongoose.Types.ObjectId(id);
        if (button === "confirm") {
            const confirm = await appointmentdb.findOneAndUpdate(
                { _id: appointid },
                { $set: { status: "confirmed" } },
                { new: true }
            );
            res.status(200).json(confirm);
        } else if (button === "cancel") {
            const cancel = await appointmentdb.findOneAndUpdate(
                { _id: appointid },
                { $set: { status: "cancelled" } },
                { new: true }
            );
            res.status(200).json(cancel);
        } else {
            return;
        }
    } catch (error) {
        res.status(500).json({ error: "internalServer error" });
    }
};

export const getAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.query;
        const myAppointmentStatus = await appointmentdb.find({ user: id }).populate("worker").sort({createdAt: -1});
        res.status(200).json(myAppointmentStatus);
    } catch (error) {
        res.status(500).json({ error: "internalServer" });
    }
};

export const deleteMyservice = async (req, res, next) => {
    try {
        const { id } = req.query;
        const deleteService = await workerdb.findOneAndDelete({ user: id });
    } catch (error) {
        res.status(500).json({ error: "internalServer" });
    }
};
