import dotenv from "dotenv"
dotenv.config()
import express from 'express';
import dbConnect from '../config/dbConnect.js';
import userRoutes from "../routes/usersRoute.js";
import { globalErrHandler, notFound } from "../middlewares/globalErrorHandler.js";
import productsRouter from "../routes/productRoute.js";
import categoriesRouter from "../routes/categoryRoute.js";
import brandsRouter from "../routes/brandsRoute.js";
import colorRouter from "../routes/colorRouter.js";
import reviewRouter from '../routes/reviewRoute.js';
import orderRouter from "../routes/orderRoute.js";
import couponsRouter from "../routes/couponRoute.js";

dbConnect()
const app=express();
app.use(express.json())

app.use("/api/v1/users", userRoutes)
app.use("/api/v1/products", productsRouter)
app.use("/api/v1/category", categoriesRouter)
app.use("/api/v1/brands", brandsRouter)
app.use("/api/v1/colors/", colorRouter);
app.use("/api/v1/reviews/", reviewRouter);
app.use("/api/v1/orders/", orderRouter);
app.use("/api/v1/coupons/", couponsRouter);


app.use(notFound)
app.use(globalErrHandler)

export default app