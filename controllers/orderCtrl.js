import asyncHandler from 'express-async-handler';
import Stripe from "stripe"
import User from '../model/user.js';
import Order from '../model/order.js';
import Product from '../model/product.js';
import dotenv from "dotenv"
import Coupon from '../model/coupon.js';
dotenv.config()

// const stripe = new Stripe(process.env.STRIPE_KEY)

export const createOrderCtrl = asyncHandler(async(req,res)=>{

    const {coupon}=req.query
    const couponfound = await Coupon.findOne({code:coupon.toUpperCase()})

    if(couponfound.isExpired){
      throw new Error("Coupon is expired")
    }
    if(!couponfound){
      throw new Error("Coupon does not exists")
    }

    const discount = couponfound.discount/100

    const {orderItems, shippingAddress, totalPrice} = req.body
    const user = await User.findById(req.userAuthId);

    if(!user.hasShippingAddress){
      throw new Error("Please provide shipping address")
    }

    if(orderItems?.length <= 0){
        throw new Error ("Plz add items")
    }

    const order = await Order.create({user:user.id, orderItems, shippingAddress, totalPrice:couponfound ? totalPrice - totalPrice*discount : totalPrice})

    // const order = await Order.create({user:user.id, orderItems, shippingAddress, totalPrice})
    console.log(order)

    const products = await Product.find({ _id: { $in: orderItems } });

    orderItems.map(async (order) => {
        const product = await products.find((product) => {
          return product._id.toString() === order._id.toString();
        });
        if (product) {
          product.totalSold += order.qty;
        }
        await product.save();
    });

    user.orders.push(order?._id)
    await user.save()

    // const convertedOrders = orderItems.map((e)=>{
    //   return {
    //     price_data: {
    //       currency: "usd",
    //       product_data: {
    //         name: e?.name,
    //         description: e?.description,
    //       },
    //       unit_amount: e?.price * 100,
    //     },
    //     quantity: e?.qty,
    //   }
    // })

    // const session = await stripe.checkout.sessions.create({
    //   line_items: convertedOrders,
    //   mode: "payment",
    //   success_url: 'http://localhost:3000/success',
    //   cancel_url: 'http://localhost:3000/cancel'
    // })

    // res.send({url: session.url})

    res.json({success:true, message:"order created successfully", order, user})
})


export const getAllordersCtrl = asyncHandler(async (req, res) => {
  //find all orders
  const orders = await Order.find().populate("user");
  res.json({
    success: true,
    message: "All orders",
    orders,
  });
});


export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
  //get the id from params
  const id = req.params.id;
  const order = await Order.findById(id);
  //send response
  res.status(200).json({
    success: true,
    message: "Single order",
    order,
  });
});


export const updateOrderCtrl = asyncHandler(async (req, res) => {
  //get the id from params
  const id = req.params.id;
  //update
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    success: true,
    message: "Order updated",
    updatedOrder,
  });
});


export const getOrderStats = asyncHandler(async(req,res)=>{
   
  const orders = await Order.aggregate([{
    $group:{
      _id: null,
      totalSales:{
        $sum:"$totalPrice"
      },
      minSale: {
        $min: "$totalPrice",
      },
      maxSale: {
        $max: "$totalPrice",
      },
      avgSale: {
        $avg: "$totalPrice",
      },
    }
  }])

  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);

  res.status(200).json({success:true, message:"sum of orders", data:orders, saleToday})
})
