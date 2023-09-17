import { getTokenFromHeader } from '../utils/getTokenFromHeader.js';
import { verifyToken } from '../utils/verifyToken.js';


export const isLoggedIn = (req, res, next)=>{
    const token = getTokenFromHeader(req);

    const decodeduser = verifyToken(token)

    if(!decodeduser){
        throw new Error("Token expired please login again")
    }
    else{
        req.userAuthId = decodeduser.id
        next()
    }
}