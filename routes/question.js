const express = require("express")

const verifyKidToken = require("../middleware/verifyKidToken.js")
const {
    questionCategoryList,
    questionList,
    questionByCategoryId,
    questionByCityId,
    answerSubmit,
} = require("../controllers/game/QuestionController")
const app = express()

app.get("/", verifyKidToken, questionList)
app.get("/category", verifyKidToken, questionCategoryList)
app.get("/category/:id", verifyKidToken, questionByCategoryId)
app.get("/city/:id", verifyKidToken, questionByCityId)

app.post("/answer_submit", verifyKidToken, answerSubmit)

module.exports = app
