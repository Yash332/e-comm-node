import Category from '../model/category.js';
import Product from '../model/product.js';
import asyncHandler from 'express-async-handler';
import Brand from '../model/brand.js';

export const createProductCtrl = asyncHandler(async(req, res)=>{

    const convertedimg = req.files.map((file)=>file.path)
    
    const {name, description, category, sizes, colors, price, totalQty, brand} = req.body

    const productExists = await Product.findOne({name})
    if(productExists){
        throw new Error ("Product already exists")
    }

    // Brand
    const brandFound = await Brand.findOne({name:brand.toLowerCase()})
    if(!brandFound){
        throw new Error("Brand not found")
    }

    // Category
    const categoryFound = await Category.findOne({name:category})
    if(!categoryFound){
        throw new Error("Category not found")
    }

    const product =await Product.create({name, description, category, sizes, colors, user:req.userAuthId, price, totalQty, brand, images:convertedimg})

    categoryFound.products.push(product._id)
    await categoryFound.save()

    brandFound.products.push(product._id)
    await brandFound.save()

    res.json({status:"success", message:"Product created successfully", data:product})
})


export const getProductsCtrl = asyncHandler(async(req, res)=>{
    const {name, brand, category, colors, sizes, price}=req.query

    let productQuery = Product.find()
    
    // filter by name
    if(name){
        productQuery = productQuery.find({
            name: { $regex: name, $options: "i" },
        });
    }

    // filter by brand
    if(brand){
        productQuery = productQuery.find({
            brand: { $regex: brand, $options: "i" },
        });
    }

    // filter by category
    if(category){
        productQuery = productQuery.find({
            category: { $regex: category, $options: "i" },
        });
    }

    // filter by colors
    if(colors){
        productQuery = productQuery.find({
            colors: { $regex: colors, $options: "i" },
        });
    }

    // filter by sizes
    if(sizes){
        productQuery = productQuery.find({
            sizes: { $regex: sizes, $options: "i" },
        });
    }

    // filter by price
    if(price){
        const pricerange = price.split("-")
        productQuery = productQuery.find({
            price: { $gte:pricerange[0], $lte:pricerange[1] },
        });
    }

    //Pgination
    const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10
    const startIndex = (page-1)*limit
    const endIndex = page*limit
    const total = await Product.countDocuments()

    productQuery = productQuery.skip(startIndex).limit(limit)
    const pagination={}
    if(endIndex<total){
        pagination.next = {
            page:page+1,
            limit
        }
    }
    if(startIndex>0){
        pagination.prev = {
            page:page-1,
            limit
        }
    }

    const products =await productQuery.populate('reviews')

    res.json({status:"success", total, count:products.length, pagination, message:"Products fetched successfully", data:products})
})


export const getSingleproduct = asyncHandler(async(req,res)=>{
    const product = await Product.findById(req.params.id).populate('reviews')

    if(!product){
        throw new Error("Product not found")
    }

    res.json({status:"Success", message:"Product fetched successfully", data:product})
})


export const updateProductCtrl = asyncHandler(async (req, res) => {
    const {name, description, category, sizes, colors, user, price, totalQty,brand} = req.body;
    //validation
  
    //update
    const product = await Product.findByIdAndUpdate(req.params.id, {name, description, category, sizes, colors, user, price, totalQty,brand}, {new: true, runValidators: true});
    
    res.json({status: "success", message: "Product updated successfully", data:product});
});


export const deleteProductCtrl = asyncHandler(async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({status: "success", message: "Product deleted successfully"});
});