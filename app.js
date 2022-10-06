import express from 'express'
import dotenv from 'dotenv'
import db from './config/Database.js'
import router from './routes/index.js'

dotenv.config()

const app = express()

try {
    await db.authenticate()
    await db.sync()
    console.log('database connected')
} catch (error) {
    console.log(error)
}

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use('/api', router)

app.listen(process.env.PORT || 5000, () => console.log(`server running at port ${process.env.PORT}`))