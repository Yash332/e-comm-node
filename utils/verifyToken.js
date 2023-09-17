import Jwt from "jsonwebtoken";

export const verifyToken = (token)=>{
    return Jwt.verify(token, process.env.JWT_KEY, (err, decoded)=>{
        if(err){
            return false
        }else{
            return decoded
        }
    })
}