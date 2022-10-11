const express = require("express")
const dotenv = require("dotenv")
const db = require("./config/Database.js")
const router = require("./routes/index.js")
const cookieParser = require("cookie-parser")
const expressBusboy = require("express-busboy")

dotenv.config()

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
    })
)

expressBusboy.extend(app)

app.use("/api", router)

app.use("/", (req, res) => {
    return res.status(404).json({
        status: false,
        message: "Unknown request",
    })
})

app.listen(process.env.PORT || 5000, () =>
    console.log(`server running on port ${process.env.PORT}`)
)
