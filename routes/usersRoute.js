import express from "express";
import {getUserCtrl, registerUserCtrl, updateShippingAddresctrl} from "../controllers/usersCtrl.js";
import {loginUserCtrl} from "../controllers/usersCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const userRoutes=express.Router()

userRoutes.post("/register", registerUserCtrl)
userRoutes.post("/login", loginUserCtrl)
userRoutes.get("/profile", isLoggedIn, getUserCtrl)
userRoutes.put("/update/shipping", isLoggedIn, updateShippingAddresctrl)

export default userRoutes;