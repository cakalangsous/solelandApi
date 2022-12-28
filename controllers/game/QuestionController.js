const QuestionCategory = require("../../models/QuestionCategory")
const Question = require("../../models/Question")
const Answer = require("../../models/Answer")
const City = require("../../models/City")
const AnswerSubmit = require("../../models/AnswerSubmit")
const { Op } = require("sequelize")

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
    const { kid } = req
    try {
        const answered = await AnswerSubmit.findAll({
            where: {
                kid_id: kid.id,
            },
            attributes: ["question_id"],
        })

        const answeredQuestion = answered.map((q) => q.question_id)

        const questions = await Question.findAll({
            where: {
                id: {
                    [Op.notIn]: answeredQuestion,
                },
            },
            include: [
                {
                    model: Answer,
                    attributes: ["id", "uuid", "answer", "isCorrect"],
                },
            ],
            attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        })

        // const newData = questions.map((question) => {})

        return res.status(200).json({
            status: true,
            message: "Get all question success",
            data: questions,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Something went wrong. Please try again.",
        })
    }
}

exports.questionByCategoryId = async (req, res) => {
    const { kid } = req

    const id = req.params.id
    try {
        const answered = await AnswerSubmit.findAll({
            where: {
                kid_id: kid.id,
            },
            attributes: ["question_id"],
        })

        const answeredQuestion = answered.map((q) => q.question_id)

        const question = await QuestionCategory.findOne({
            where: {
                id,
            },
            include: {
                model: Question,
                attributes: {
                    exclude: ["createdAt", "updatedAt", "deletedAt"],
                },
                where: {
                    id: {
                        [Op.notIn]: answeredQuestion,
                    },
                },
                include: {
                    model: Answer,
                    attributes: ["id", "uuid", "answer", "isCorrect"],
                },
            },
            attributes: ["id", "uuid", "name"],
        })

        return res.status(200).json({
            status: true,
            message: "Get all questions by category success",
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

exports.questionByCityId = async (req, res) => {
    const { kid } = req
    const id = req.params.id
    try {
        const answered = await AnswerSubmit.findAll({
            where: {
                kid_id: kid.id,
            },
            attributes: ["question_id"],
        })

        const answeredQuestion = answered.map((q) => q.question_id)

        const question = await City.findOne({
            where: {
                id,
            },
            include: {
                model: Question,
                where: {
                    id: {
                        [Op.notIn]: answeredQuestion,
                    },
                },
                attributes: {
                    exclude: ["createdAt", "updatedAt", "deletedAt"],
                },
                include: {
                    model: Answer,
                    attributes: ["id", "uuid", "answer", "isCorrect"],
                },
            },
            attributes: ["id", "uuid", "name"],
        })

        return res.status(200).json({
            status: true,
            message: "Get all questions by city success",
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

exports.answerSubmit = async (req, res) => {
    const { kid } = req

    const { question_id, answer_id } = req.body

    if (question_id === undefined || answer_id === undefined) {
        return res.status(422).json({
            status: false,
            message: "question_id and answer_id are required.",
        })
    }

    try {
        const question = await Question.findOne({
            where: {
                id: question_id,
            },
            include: [
                {
                    model: QuestionCategory,
                },
                {
                    model: City,
                },
            ],
        })

        const answer = await Answer.findOne({
            where: {
                id: answer_id,
            },
        })

        if (answer.question_id !== question.id) {
            return res.status(422).json({
                status: false,
                message: "Answer is not related to question",
            })
        }

        const submit = await AnswerSubmit.create({
            kid_id: kid.id,
            category_id: question.category_id,
            category_name: question.question_category.name,
            city_id: question.city_id,
            city_name: question.city.name,
            question_id,
            question: question.question,
            type: question.type,
            answer_id,
            answer: answer.answer,
            isCorrect: answer.isCorrect,
            reward_exp: question.reward_exp,
            reward_item: question.reward_item,
        })

        return res.status(200).json({
            status: true,
            message: "Answer submitted.",
            data: submit,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Something went wrong. Please try again",
        })
    }
}
