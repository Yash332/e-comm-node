import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createCategoryCtrl, deleteCategoryCtrl, getAllCategoriesCtrl, getSingleCategoryCtrl, updateCategoryCtrl } from "../controllers/categoriesCtrl.js";
import upload from "../config/fileUpload.js";

const categoriesRouter = express.Router();

categoriesRouter.post("/", isLoggedIn, upload.single("file"), createCategoryCtrl);
categoriesRouter.get("/", isLoggedIn, getAllCategoriesCtrl);
categoriesRouter.get("/:id", isLoggedIn, getSingleCategoryCtrl);
categoriesRouter.put("/:id", isLoggedIn, updateCategoryCtrl);
categoriesRouter.delete("/:id", isLoggedIn, deleteCategoryCtrl);

export default categoriesRouter;