const { Sequelize } = require("sequelize")
const db = require("../config/Database.js")
const Question = require("./Question.js")

const { DataTypes } = Sequelize

const Answer = db.define(
    "answers",
    {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        question_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        answer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isCorrect: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0,
        },
    },
    {
        freezeTableName: true,
        paranoid: true,
        deletedAt: "deletedAt",
    }
)

module.exports = Answer
