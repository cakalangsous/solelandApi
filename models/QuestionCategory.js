const { Sequelize } = require("sequelize")
const db = require("../config/Database.js")

const { DataTypes } = Sequelize

const QuestionCategory = db.define(
    "question_categories",
    {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
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

module.exports = QuestionCategory
