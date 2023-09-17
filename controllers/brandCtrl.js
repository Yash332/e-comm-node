import asyncHandler from "express-async-handler";
import Brand from "../model/brand.js";


export const createBrandCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //brand exists
  const brandFound = await Brand.findOne({ name });
  if (brandFound) {
    throw new Error("Brand already exists");
  }
  //create
  const brand = await Brand.create({name: name.toLowerCase(),user: req.userAuthId});

  res.json({status: "success",message: "Brand created successfully",data:brand});
});


export const getAllBrandsCtrl = asyncHandler(async (req, res) => {
  const brands = await Brand.find();
  res.json({status: "success",message: "Brands fetched successfully",data:brands});
});


export const getSingleBrandCtrl = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  res.json({status: "success",message: "brand fetched successfully",data:brand});
});


export const updateBrandCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  //update
  const brand = await Brand.findByIdAndUpdate(req.params.id,{name},{new: true});
  res.json({status: "success",message: "brand updated successfully",data:brand});
});


export const deleteBrandCtrl = asyncHandler(async (req, res) => {
  await Brand.findByIdAndDelete(req.params.id);
  res.json({status: "success", message: "brand deleted successfully"});
});