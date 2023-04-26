import Express from "express";
import upload from "../middleware/multer.js";

import { adminLogin, postAdmin } from "../controller/admin/adminlogin.js";
import {
    dashBoard,
    userList,
    blockUser,
    unblockUser,
    addService,
    deleteService,
    dashBoarduserList,
    ProfitData,
    workerList,
    approveWorker,
} from "../controller/admin/dashboardcontroller.js";
import { addSubscription, getSubscriptions } from "../controller/user/servicecontroller.js";

const router = Express.Router();
//login APIs
router.get("/", adminLogin);
router.post("/adminlogin", postAdmin);
//dashbord controlling APIs
router.get("/dashboard", dashBoard);
router.get("/userlist", userList);
router.get("/workerslist",workerList)
router.post("/approveworker", approveWorker)

router.post("/blockuser", blockUser);
router.post("/unblockuser", unblockUser);
router.get("/getuserdata", dashBoarduserList)
router.get("/getprofitdata", ProfitData)

router.post("/addservice", upload.single("image"), addService);
router.delete("/deleteservices/:id", deleteService);
router.post("/addsubscription", addSubscription);
router.get("/subscriptions", getSubscriptions);
export default router;
