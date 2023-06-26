import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()
const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY

export const verifyTokenAdmin = (req, res, next) => {
    const token = (req.headers.authorization).replace("Bearer ", "")
    if (token) {
        jwt.verify(token, PRIVATE_KEY, (err, decodeToken) => {
            if (err) {
                return res.sendStatus(403)
            }
            req.userId = decodeToken.id
            req.role = decodeToken.role

            if (req.userId && req.role === "admin") {
                next()
            } else res.sendStatus(401)
        })
    } else {
        res.sendStatus(401)
    }
}