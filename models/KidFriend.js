const { Sequelize } = require("sequelize")
const db = require("../config/Database.js")
const Kid = require("./KidModel")

const { DataTypes } = Sequelize

const KidFriend = db.define("kid_friends", {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
    },
    approve_status: {
        type: DataTypes.ENUM("pending", "approved"),
        defaultValue: "pending",
    },
})

KidFriend.belongsTo(Kid, {
    foreignKey: "source_id",
    as: "source_kid",
    targetKey: "id",
})

KidFriend.belongsTo(Kid, {
    foreignKey: "target_id",
    as: "target_kid",
    targetKey: "id",
})

module.exports = KidFriend
