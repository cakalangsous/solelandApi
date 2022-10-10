import { Sequelize } from "sequelize"
import db from "../config/Database.js"

const { DataTypes } = Sequelize

const KidInventory = db.define("kids_inventory", {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
    },
    kid_id: {
        type: DataTypes.INTEGER,
    },
    slot: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
})

export default KidInventory