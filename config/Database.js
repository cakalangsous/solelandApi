const { Sequelize } = require("sequelize")
const dbConfig = require("./db.config.js")

console.log(dbConfig)

const db = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: "localhost",
    dialect: "mysql",
})

const connect = async (req, res) => {
    try {
        await db.authenticate()
        // await db.sync({ alter: true, force: true })
        // await db.sync({ alter: true })
        console.log("database connected")
    } catch (error) {
        console.log(error)
    }
}

connect()

module.exports = db
