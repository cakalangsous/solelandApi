import express from "express"
import dotenv from "dotenv"
import db from "./config/Database.js"
import router from "./routes/index.js"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()

try {
    await db.authenticate()
    // await db.sync()
    console.log("database connected")
} catch (error) {
    console.log(error)
}

app.use(cookieParser())
app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
    })
)

app.use("/api", router)

app.use("/", (req, res) => {
    return res.status(404).json({
        status: false,
        message: "Unknown request",
    })
})

app.listen(() => console.log(`server running`))
