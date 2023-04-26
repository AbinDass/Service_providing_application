import express from "express";
import upload from "../middleware/multer.js";

// eslint-disable-next-line import/named
import { Login, postLogin, signup, postSignup, googleAuth } from "../controller/user/logincontroller.js";
import { createLike, createPosts, deleteMyPost, getMypost, getPosts } from "../controller/user/postcontroller.js";
import { createComment, getAllComments } from "../controller/user/commentcontroller.js";
import {
    SearchServiceTitle,
    acceptRequest,
    addServiceByuser,
    cancelRequest,
    checkServiceAdded,
    checksubscriptionExpired,
    deleteMyservice,
    getAcceptStatus,
    getAllrequests,
    getAppointment,
    getAppointmentStatus,
    getMyservice,
    getServices,
    getWorkerList,
    getdistrict,
    makeAppointment,
    rejectRequest,
    requestService,
    requestStatus,
    takeSubscription,
    updateAppointment,
    verifyPayment,
} from "../controller/user/servicecontroller.js";
import { User, editProfile } from "../controller/user/usercontroller.js";
import { checkSubscriptionIstrue } from "../controller/user/servicecontroller.js";
import {
    CreateConversation,
    getAllmessages,
    getConversation,
    getConversationsBWtwo,
    searchUsers,
    sendMessage,
} from "../controller/user/chatcontroller.js";
import { verifyToken } from "../middleware/userauthentication.js";
const router = express.Router();
//user APIs
router.get("/login", Login);
router.post("/postlogin", postLogin);
router.get("/signup", signup);
router.post("/postsignup", postSignup);
router.post("/googleauth", googleAuth);


router.post("/createpost",verifyToken, createPosts);
router.post("/addcomment/:id",verifyToken, createComment);
router.get("/posts", getPosts);
router.delete("/posts",verifyToken, deleteMyPost);
router.get("/posts/getComments/:id",verifyToken, getAllComments);
router.patch("/likepost",verifyToken, createLike);

router.get("/getprofile",verifyToken, User);
router.post("/editprofile",verifyToken, editProfile);

router.get("/services", getServices);
router.post("/addservices", addServiceByuser);
router.get("/workerlist", getWorkerList);
router.delete("/deleteMyservice", deleteMyservice);

router.post("/takesubscription", takeSubscription);
router.get("/checksubscriptionExpired",verifyToken ,checksubscriptionExpired)
router.post("/verfypayment", verifyPayment);

router.post("/requestWorker", requestService);
router.get("/getRequestStatus", requestStatus);
router.get("/getAllrequests", getAllrequests);
router.post("/acceptRequest", acceptRequest);
router.delete("/cancelRequest", cancelRequest);
router.delete("/rejectRequest", rejectRequest);
router.get("/getAcceptRequestStatus", getAcceptStatus);

router.get("/checkServiceadded", checkServiceAdded);
router.get("/checkSubscription", checkSubscriptionIstrue);

router.get("/searchservice", SearchServiceTitle);
router.get("/district", getdistrict);

router.post("/conversation", verifyToken, CreateConversation);
router.get("/getmsg/:userId", verifyToken, getConversation);
router.post("/addmessage", verifyToken, sendMessage);
router.get("/allmessages/:conversationId", verifyToken, getAllmessages);

router.post("/searchUser", searchUsers);

router.get("/findconversations/:user1Id/:user2Id", getConversationsBWtwo);
router.get("/myservice/:id", getMyservice);
router.get("/myposts", getMypost);

router.post("/makeAppointment", makeAppointment);
router.patch("/makeAppointment", updateAppointment);
router.get("/getAppointment", getAppointment);
router.get("/getAppointmentStatus", getAppointmentStatus);

export default router;
