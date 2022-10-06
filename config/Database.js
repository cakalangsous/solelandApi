import { Sequelize } from 'sequelize'

const db = new Sequelize('soleland_api', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

export default db