import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;

        // Strict validation: check for missing, empty, or literal string traps
        if (!token || token === "" || token === "null" || token === "undefined") {
            return res.status(401).json({ success: false, message: "Not Authorized. Please login again." });
        }
        
        // Verify token securely
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the real decoded ID to the body parameters
        req.body.userId = token_decode.id; 
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({ success: false, message: "Session expired or invalid token. Login again." });
    }
}

export default authUser;