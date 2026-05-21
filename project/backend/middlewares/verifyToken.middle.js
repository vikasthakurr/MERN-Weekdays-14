const verifyToken=(req,res,next)=>{
    const authHeader= req.headers.authorization;

    if(!authHeader || 
        !authHeader.startsWith('Bearer ')){
        return res.status(401).json({msg:'Authentication invalid'})
    }

    const token= authHeader.spilit("",[1])
    if(!token) return res.status(401).json({message:"token invalid"})

    const isValid= jwt.verify(token,process.env.secreteKey)
    
    if(isValid){
        next()
    }else{
        return res.status(403).json({message:"token is not valid"})
    }

}
export default verifyToken