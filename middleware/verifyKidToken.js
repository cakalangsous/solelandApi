const jwt = require("jsonwebtoken")
const Kids = require("../models/KidModel")

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization

    const token = authHeader && authHeader.split(" ")[1]

    if (token == null)
        return res.status(200).json({ status: false, message: "Unauthorized" })

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err)
            return res
                .status(200)
                .json({ status: false, message: "Unknown token." })

        const checkKid = async () => {
            try {
                const kid = await Kids.findOne({
                    where: {
                        uuid: decoded.uuid,
                    },
                })

                return kid
            } catch (error) {
                console.log(error)
                return res
                    .status(403)
                    .json({ status: false, message: "Unknown token data" })
            }
        }

        req.username = decoded.username
        req.uuid = decoded.uuid
        req.kid = await checkKid()

        next()
    })
}

module.exports = verifyToken
