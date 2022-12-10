const { Sequelize } = require("sequelize")
const db = require("../config/Database.js")
const City = require("./City.js")

const { DataTypes } = Sequelize

const Solepedia = db.define(
    "solepedia",
    {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        city_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        paranoid: true,
        deletedAt: "deletedAt",
    }
)

Solepedia.belongsTo(City, {
    foreignKey: "city_id",
})

module.exports = Solepedia
