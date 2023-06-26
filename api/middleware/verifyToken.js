import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()
const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY

export const verifyToken = (req, res, next) => {
    const token = (req.headers.authorization).replace("Bearer ", "")
    if (token) {
        jwt.verify(token, PRIVATE_KEY, (err, decodeToken) => {
            if (err) {
                return res.sendStatus(403)
            }
            req.userId = decodeToken.id
            req.role = decodeToken.role

            next()
        })
    } else {
        res.sendStatus(401)
    }
}