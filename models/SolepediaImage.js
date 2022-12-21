const { Sequelize } = require("sequelize")
const db = require("../config/Database.js")
const Solepedia = require("./Solepedia.js")

const { DataTypes } = Sequelize

const SolepediaImage = db.define(
    "solepedia_images",
    {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        solepedia_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        content: {
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

SolepediaImage.belongsTo(Solepedia, {
    foreignKey: "solepedia_id",
    as: "contents",
})

Solepedia.hasMany(SolepediaImage, {
    foreignKey: "solepedia_id",
    as: "content",
})

module.exports = SolepediaImage
