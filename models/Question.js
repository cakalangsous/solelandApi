const { Sequelize } = require("sequelize")
const db = require("../config/Database.js")
const QuestionCategory = require("./QuestionCategory.js")
const City = require("./City")
const Answer = require("./Answer.js")

const { DataTypes } = Sequelize

const Question = db.define(
    "questions",
    {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        category_id: {
            type: DataTypes.INTEGER,
        },
        city_id: {
            type: DataTypes.INTEGER,
        },
        type: {
            type: DataTypes.ENUM("multiple_choice", "fill_blank"),
            allowNull: false,
        },
        question: {
            type: DataTypes.STRING,
            allowNull: false,
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

Question.belongsTo(QuestionCategory, {
    foreignKey: "category_id",
})

QuestionCategory.hasMany(Question, {
    foreignKey: "category_id",
})

Question.belongsTo(City, {
    foreignKey: "city_id",
})

City.hasMany(Question, {
    foreignKey: "city_id",
})

Question.hasMany(Answer, {
    foreignKey: "question_id",
})

Answer.belongsTo(Question, {
    foreignKey: "question_id",
})

module.exports = Question
