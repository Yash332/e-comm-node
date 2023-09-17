import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        fullname:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        orders:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Order"
            }
        ],
        wishlist:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Wishlist"
            }
        ],
        isAdmin:{
            type:Boolean,
            default:false
        },
        hasShippingAddress:{
            type:Boolean,
            default:false
        },
        shippingAddress:{
            firstname:{
                type:String
            },
            lastname:{
                type:String
            },
            address:{
                type:String
            },
            city:{
                type:String
            },
            postalCode:{
                type:String
            },
            state:{
                type:String
            },
            country:{
                type:String
            },
            phone:{
                type:String
            }
        }
    },
    {
        timestamps:true
    }
);

const User = mongoose.model("User", userSchema);
export default User;