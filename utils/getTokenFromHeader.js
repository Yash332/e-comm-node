export const getTokenFromHeader = (req)=>{
    const token = req?.headers?.authorization?.split(" ")[1]

    if(!token){
        return "Please Insert token in the headers"
    }else{
        return token
    }
}