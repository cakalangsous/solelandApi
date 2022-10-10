import dotenv from "dotenv"
dotenv.config()

const dbConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
}

export default dbConfig
