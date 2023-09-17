import exppress from "express";
import {createCouponCtrl, deleteCouponCtrl, getAllCouponCtrl, getCouponCtrl, updateCouponCtrl} from "../controllers/couponCtrl.js";
// import isAdmin from "../middlewares/isAdmin.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";

const couponsRouter = exppress.Router();

couponsRouter.post("/", isLoggedIn, isAdmin, createCouponCtrl);
couponsRouter.get("/", getAllCouponCtrl);
couponsRouter.put("/update/:id", isLoggedIn, isAdmin, updateCouponCtrl);
couponsRouter.delete("/delete/:id", isLoggedIn, isAdmin, deleteCouponCtrl);
couponsRouter.get("/single", getCouponCtrl);


export default couponsRouter;
