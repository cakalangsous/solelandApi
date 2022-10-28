const Parent = require("../../models/ParentModel.js")
const jwt = require("jsonwebtoken")

exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken)
            return res
                .status(401)
                .json({ status: false, message: "Unknown refresh token" })

        const parent = await Parent.scope("withRefreshToken").findOne({
            where: {
                refreshToken,
            },
        })

        if (!parent)
            return res
                .status(403)
                .json({ status: false, message: "Access forbidden" })
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err) {
                    return res
                        .status(403)
                        .json({ status: false, message: "Access forbidden" })
                }

                const uuid = parent.uuid
                const username = parent.username
                const email = parent.email

                const accessToken = jwt.sign(
                    { uuid, username, email },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "15s" }
                )

                return res.json({
                    status: true,
                    message: "Refresh token success",
                    accessToken,
                })
            }
        )
    } catch (error) {
        console.log(error)
    }
}
