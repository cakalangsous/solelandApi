const Kid = require("../../../models/KidModel.js")
const KidFriend = require("../../../models/KidFriend")
const Sequelize = require("sequelize")
const Op = Sequelize.Op
const { getAge } = require("../../../utils/getAge")
const { approveStatus } = require("../../../utils/enums")
const db = require("../../../config/Database")

exports.list = async (req, res) => {
    const { uuid, kid } = req

    try {
        const friends = await KidFriend.findAll({
            where: {
                [Op.or]: [{ source_id: kid.id }, { target_id: kid.id }],
                approve_status: approveStatus.APPROVED,
            },
            include: [
                {
                    required: true,
                    model: Kid,
                    as: "source_kid",
                    attributes: [
                        "id",
                        "uuid",
                        "username",
                        "name",
                        "gender",
                        "level",
                        "experience",
                    ],
                },
                {
                    required: true,
                    model: Kid,
                    as: "target_kid",
                    attributes: [
                        "id",
                        "uuid",
                        "username",
                        "name",
                        "gender",
                        "level",
                        "experience",
                    ],
                },
            ],
            attributes: [
                "id",
                "uuid",
                "source_id",
                "target_id",
                "approve_status",
                "createdAt",
                "updatedAt",
            ],
        })

        const newData = friends.map((friend) => {
            let data = {}

            if (friend.source_kid.id === kid.id) {
                data = friend.target_kid
                data.setDataValue("approve_status", friend.approve_status)
                data.setDataValue("sender_status", true)
            }

            if (friend.target_kid.id === kid.id) {
                data = friend.source_kid
                data.setDataValue("approve_status", friend.approve_status)
                data.setDataValue("sender_status", false)
            }

            return data
        })

        return res.status(200).json({
            status: true,
            message: "Get kid friends success",
            kid_friends_total: newData.length,
            kid_friends: newData,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Unknown Error",
        })
    }
}

exports.addFriend = async (req, res) => {
    const { uuid, kid } = req

    if (!req.body.target_id) {
        return res.status(422).json({
            status: false,
            message: "target_id is required",
        })
    }

    const { target_id } = req.body

    if (target_id == kid.id) {
        return res.status(400).json({
            status: false,
            message: "Cannot add friend to yourself",
        })
    }

    const target = await Kid.findOne({
        where: {
            id: target_id,
        },
    })

    if (!target) {
        return res.status(404).json({
            status: false,
            message: "Unknown target provided",
        })
    }

    const requested = await KidFriend.findOne({
        where: {
            [Op.or]: [
                {
                    source_id: kid.id,
                    target_id: target.id,
                },
                {
                    source_id: target.id,
                    target_id: kid.id,
                },
            ],
        },
    })

    if (requested) {
        return res.status(422).json({
            status: false,
            message: "Already sent request or requested",
        })
    }

    try {
        const added = await KidFriend.create({
            source_id: kid.id,
            target_id: target.id,
        })

        return res.status(201).json({
            status: true,
            message: "Friend request sent",
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Something went wrong. Please try again.",
        })
    }
}

exports.approve = async (req, res) => {
    const { uuid, kid } = req

    if (req.body.source_id === undefined) {
        return res.status(422).json({
            status: false,
            message: "source_id is required",
        })
    }

    const { source_id } = req.body

    const request = await KidFriend.findOne({
        where: {
            source_id,
            approve_status: approveStatus.PENDING,
        },
    })

    if (!request) {
        return res.status(422).json({
            status: false,
            message: "Unknown source provided",
        })
    }

    if (request.target_id !== kid.id) {
        return res.status(422).json({
            status: false,
            message: "Unknown source provided",
        })
    }

    try {
        request.approve_status = approveStatus.APPROVED
        await request.save()

        return res.status(200).json({
            status: true,
            message: "Friend request approved",
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Something went wrong. Please try again",
        })
    }
}

exports.decline = async (req, res) => {
    const { kid } = req

    if (req.body.friend_request_id === undefined) {
        return res.status(422).json({
            status: false,
            message: "friend_request_id is required",
        })
    }

    const { friend_request_id } = req.body

    const request = await KidFriend.findOne({
        where: {
            id: friend_request_id,
            approve_status: approveStatus.PENDING,
        },
    })

    if (!request) {
        return res.status(422).json({
            status: false,
            message: "Unknown source provided",
        })
    }

    if (request.source_id !== kid.id && request.target_id !== kid.id) {
        return res.status(406).json({
            status: false,
            message: "Unknown source provided",
        })
    }

    try {
        await request.destroy()

        return res.status(200).json({
            status: true,
            message: "Friend request declined / removed",
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Something went wrong. Please try again",
        })
    }
}

exports.getPending = async (req, res) => {
    const { kid } = req

    try {
        const pending = await KidFriend.findAll({
            where: {
                source_id: kid.id,
                approve_status: approveStatus.PENDING,
            },
            include: [
                {
                    required: true,
                    model: Kid,
                    as: "source_kid",
                    attributes: [
                        "id",
                        "uuid",
                        "username",
                        "name",
                        "gender",
                        "level",
                        "experience",
                    ],
                },
                {
                    required: true,
                    model: Kid,
                    as: "target_kid",
                    attributes: [
                        "id",
                        "uuid",
                        "username",
                        "name",
                        "gender",
                        "level",
                        "experience",
                    ],
                },
            ],
            attributes: [
                "id",
                "uuid",
                "approve_status",
                "createdAt",
                "updatedAt",
            ],
        })

        const newData = pending.map((friend) => {
            let data = friend

            if (friend.source_kid.id === kid.id) {
                // data = friend.target_kid
                data.setDataValue("sender_status", true)
            }

            if (friend.target_kid.id === kid.id) {
                // data = friend.source_kid
                data.setDataValue("sender_status", false)
            }

            // data.setDataValue("friend_request_uuid", friend.uuid)

            return data
        })

        return res.status(200).json({
            status: true,
            message: "Get pending approve success",
            pending_approve_total: newData.length,
            pending_approve: newData,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Something went wrong. Please try again.",
        })
    }
}

exports.request = async (req, res) => {
    const { kid } = req

    try {
        const request = await KidFriend.findAll({
            where: {
                target_id: kid.id,
                approve_status: approveStatus.PENDING,
            },
            include: [
                {
                    required: true,
                    model: Kid,
                    as: "source_kid",
                    attributes: [
                        "id",
                        "uuid",
                        "username",
                        "name",
                        "gender",
                        "level",
                        "experience",
                    ],
                },
                {
                    required: true,
                    model: Kid,
                    as: "target_kid",
                    attributes: [
                        "id",
                        "uuid",
                        "username",
                        "name",
                        "gender",
                        "level",
                        "experience",
                    ],
                },
            ],
            attributes: [
                "id",
                "uuid",
                "approve_status",
                "createdAt",
                "updatedAt",
            ],
        })

        const newData = request.map((friend) => {
            let data = friend

            if (friend.source_kid.id === kid.id) {
                // data = friend.target_kid
                // data.setDataValue("approve_status", friend.approve_status)
                data.setDataValue("sender_status", true)
            }

            if (friend.target_kid.id === kid.id) {
                // data = friend.source_kid
                // data.setDataValue("approve_status", friend.approve_status)
                data.setDataValue("sender_status", false)
            }

            return data
        })

        return res.status(200).json({
            status: true,
            message: "Get friend request success",
            friend_request_total: newData.length,
            friend_request: newData,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Something went wrong. Please try again.",
        })
    }
}

exports.search = async (req, res) => {
    const { uuid, kid } = req

    if (!req.body.search_query) {
        return res.status(422).json({
            status: false,
            message: "Please provide the query",
        })
    }
    const { search_query } = req.body

    try {
        const kidResults = await Kid.findAll({
            where: {
                username: {
                    [Op.like]: `%${search_query}%`,
                },
                id: { [Op.ne]: kid.id },
            },
            attributes: ["id", "username", "level", "gender"],
        })

        await Promise.all(
            kidResults.map(async (kidMapped) => {
                const kid_friends = await KidFriend.findOne({
                    where: {
                        source_id: {
                            [Op.or]: [kid.id, kidMapped.id],
                        },
                        target_id: {
                            [Op.or]: [kid.id, kidMapped.id],
                        },
                    },
                    attributes: [
                        "id",
                        "approve_status",
                        "source_id",
                        "target_id",
                    ],
                })

                let data = null

                if (kid_friends) {
                    // kid_friends.source_id !== kid.id
                    //     ? kid_friends.setDataValue("sender_status", false)
                    //     : kid_friends.setDataValue("sender_status", true)
                    data = {
                        id: kid_friends.id,
                        approve_status: kid_friends.approve_status,
                    }

                    kid_friends.source_id !== kid.id
                        ? (data.sender_status = false)
                        : (data.sender_status = true)
                }

                return kidMapped.setDataValue("kid_friends", data)
            })
        )

        return res.status(200).json({
            status: true,
            message: "Search kid success",
            total: kidResults.length,
            data: kidResults,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Something went wrong. Please try again.",
        })
    }
}
