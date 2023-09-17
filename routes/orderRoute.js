import express from "express"
import { createOrderCtrl, getAllordersCtrl, getOrderStats, getSingleOrderCtrl, updateOrderCtrl } from "../controllers/orderCtrl.js"
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const orderRouter = express.Router()

orderRouter.post("/", isLoggedIn, createOrderCtrl)
orderRouter.get("/", isLoggedIn, getAllordersCtrl)
orderRouter.get("/sales/stats", isLoggedIn, getOrderStats)
orderRouter.get("/:id", isLoggedIn, getSingleOrderCtrl)
orderRouter.put("/update/:id", isLoggedIn, updateOrderCtrl)

export default orderRouter