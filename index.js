const express = require("express")
const dotenv = require("dotenv")
const router = require("./routes/index.js")
const cookieParser = require("cookie-parser")
const expressBusboy = require("express-busboy")
const cors = require("cors")

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

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Credentials", true)
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept  "
    )
    next()
})

app.use(
    cors({
        origin: process.env.FRONT_URL,
        withCredentials: true,
        credentials: "include",
    })
)

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
