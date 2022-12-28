const { Sequelize } = require("sequelize")
const db = require("../config/Database.js")
const Answer = require("./Answer.js")
const Kids = require("./KidModel.js")
const Question = require("./Question.js")

const { DataTypes } = Sequelize

const AnswerSubmit = db.define(
    "answer_submit",
    {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        kid_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        category_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        city_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        question_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        question: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM("multiple_choice", "fill_blank"),
            allowNull: false,
        },
        answer_id: {
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
        reward_exp: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
        reward_item: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
    },
    {
        freezeTableName: true,
        paranoid: true,
        deletedAt: "deletedAt",
    }
)

AnswerSubmit.belongsTo(Kids, {
    foreignKey: "kid_id",
})

AnswerSubmit.belongsTo(Question, {
    foreignKey: "question_id",
    as: "questions",
})

AnswerSubmit.belongsTo(Answer, {
    foreignKey: "answer_id",
    as: "answers",
})

Question.hasMany(AnswerSubmit, {
    foreignKey: "question_id",
})

module.exports = AnswerSubmit
