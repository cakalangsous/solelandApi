import { Sequelize } from "sequelize"
import dbConfig from "./db.config.js"

console.log(dbConfig)

const db = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
})

export default db
