const QuestionCategory = require("../../models/QuestionCategory")
const Question = require("../../models/Question")
const Answer = require("../../models/Answer")

exports.questionCategoryList = async (req, res) => {
    try {
        const questionCategory = await QuestionCategory.findAll()

        return res.status(200).json({
            status: true,
            message: "Get all question success",
            data: questionCategory,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Something went wrong. Please try again.",
        })
    }
}

exports.questionList = async (req, res) => {
    try {
        const question = await Question.findAll({
            include: {
                model: Answer,
                attributes: ["id", "uuid", "answer", "isCorrect"],
            },
        })

        return res.status(200).json({
            status: true,
            message: "Get all question success",
            data: question,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Something went wrong. Please try again.",
        })
    }
}
