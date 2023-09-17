import cloudinaryPackage from "cloudinary"
const cloudinary = cloudinaryPackage.v2
import dotenv from "dotenv"
dotenv.config()
import multer from "multer"
import {CloudinaryStorage} from "multer-storage-cloudinary"

cloudinary.config({
    cloud_name: process.env.CLODINARY_CLOUD_NAME,
    api_key: process.env.CLODIANRY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET_KEY
})

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats:["jpg", "png", "jpeg"],
    params:{
        folder:"ecommerce-api"
    }
})

const upload = multer({storage})

export default upload