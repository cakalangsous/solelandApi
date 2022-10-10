import dotenv from "dotenv"
dotenv.config()

const dbConfig = {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
}

export default dbConfig
