const { Sequelize } = require("sequelize")
const db = require("../config/Database.js")
const Kid = require("./KidModel")

const { DataTypes } = Sequelize

const KidPet = db.define("kid_pets", {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
    },
    kid_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM("Playto", "Dela", "Bravo"),
        allowNull: false,
    },
    lastHealth: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    customization: {
        type: DataTypes.TEXT,
    },
})

KidPet.belongsTo(Kid, {
    foreignKey: {
        name: "kid_id",
    },
})
Kid.hasOne(KidPet, {
    foreignKey: {
        name: "kid_id",
    },
})

module.exports = KidPet
