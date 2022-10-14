const { Sequelize } = require("sequelize")
const db = require("../config/Database.js")
const Kid = require("./KidModel")

const { DataTypes } = Sequelize

const KidInventory = db.define("kids_inventory", {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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

KidInventory.belongsTo(Kid, {
    foreignKey: {
        name: "kidId",
    },
})
Kid.hasMany(KidInventory, {
    foreignKey: {
        name: "kidId",
    },
})

module.exports = KidInventory
