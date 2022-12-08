const jwt = require("jsonwebtoken")
const Parents = require("../models/ParentModel")

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization

    const token = authHeader && authHeader.split(" ")[1]

    if (token == null) {
        console.log("token is null")
        return res.status(401).json({ status: false, message: "Unauthorized" })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log("token is invalid", err)
            return res
                .status(401)
                .json({ status: false, message: "Unauthorized" })
        }

        const checkParent = async () => {
            try {
                const parent = await Parents.findOne({
                    where: {
                        uuid: decoded.uuid,
                        email: decoded.email,
                    },
                })

                return parent
            } catch (error) {
                console.log(error)
                return res
                    .status(403)
                    .json({ status: false, message: "Unknown token data" })
            }
        }

        checkParent()

        req.email = decoded.email
        req.uuid = decoded.uuid

        next()
    })
}

module.exports = verifyToken
