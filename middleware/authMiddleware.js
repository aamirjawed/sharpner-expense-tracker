const jwt = require('jsonwebtoken')

const verifyToken = async (req, res, next) => {

    try {
        const cookies = req.cookies;
    
        const {token} = cookies;

        if(!token){
            return res.status(401).json({error:"Access denied"})
        }
    
        const decodedMessage = await jwt.verify(token, "aamir$jawed$learing$65")
    
        const {id} = decodedMessage;
        req.userId = decodedMessage.id;
        next()
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        return res.status(401).json({ error: "Invalid or expired token." });
    }
    
}

module.exports = verifyToken


















