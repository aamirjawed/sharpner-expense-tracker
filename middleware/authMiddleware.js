const jwt = require('jsonwebtoken')
const path = require('path')

const verifyToken = async (req, res, next) => {

    try {
        const cookies = req.cookies;
    
        const {token} = cookies;

        if(!token){
           return res.sendFile(path.join(__dirname, '../public/login.html'))    
        }
    
        const decodedMessage = jwt.verify(token, process.env.SECRET)
    
        const {id} = decodedMessage;
        req.userId = decodedMessage.id;
        next()
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        return res.status(401).json({ error: "Invalid or expired token." });
    }
    
}

module.exports = verifyToken


















