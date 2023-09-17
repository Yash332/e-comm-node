import Coupon from "../model/coupon.js"
import asyncHandler from 'express-async-handler';


export const createCouponCtrl = asyncHandler(async(req,res)=>{
    const {code,startDate,endDate,discount} = req.body

    const couponExists = await Coupon.findOne({code})
    if(couponExists){
        throw new Error("Coupon already exists")
    }
    if(isNaN(discount)){
        throw new Error("discount value must be an number")
    }
    const coupon = await Coupon.create({code:code.toUpperCase(),startDate,endDate,discount,user:req.userAuthId})

    res.status(201).json({status:"success", msg:"coupon created successfully", coupon})
})


export const getAllCouponCtrl = asyncHandler(async(req,res)=>{
    const coupon = await Coupon.find();
    res.status(200).json({status:"success", msg:"All Coupons", data:coupon})
})

export const getCouponCtrl = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);
    
    res.json({status: "success", message: "Coupon fetched", data:coupon});
});

export const updateCouponCtrl = asyncHandler(async (req, res) => {
    const { code, startDate, endDate, discount } = req.body;
    const coupon = await Coupon.findByIdAndUpdate(req.params.id,
      {
        code: code?.toUpperCase(),
        discount,
        startDate,
        endDate,
      },
      {
        new: true,
      }
    );
    res.json({status: "success", message: "Coupon updated successfully", data:coupon});
});

export const deleteCouponCtrl = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    res.json({status: "success", message: "Coupon deleted successfully", data:coupon});
});