const express = require("express")

const verifyKidToken = require("../middleware/verifyKidToken.js")
const {
    questionCategoryList,
    questionList,
} = require("../controllers/game/QuestionController")
const app = express()

app.get("/", verifyKidToken, questionList)
app.get("/category/:category_id", verifyKidToken, questionCategoryList)

module.exports = app
