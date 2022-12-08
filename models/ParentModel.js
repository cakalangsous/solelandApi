const { Sequelize } = require("sequelize")
const db = require("../config/Database.js")
const Kid = require("./KidModel")

const { DataTypes } = Sequelize

const Parents = db.define(
    "parents",
    {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        emailVerifyToken: {
            type: DataTypes.TEXT,
        },
        emailVerifiedAt: {
            type: DataTypes.DATE,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        googleId: {
            type: DataTypes.STRING,
        },
        facebookId: {
            type: DataTypes.STRING,
        },
        twitterId: {
            type: DataTypes.STRING,
        },
        refreshToken: {
            type: DataTypes.TEXT,
        },
    },
    {
        freezeTableName: true,
        paranoid: true,
        deletedAt: "deletedAt",
        defaultScope: {
            attributes: {
                exclude: [
                    "password",
                    "emailVerifyToken",
                    "refreshToken",
                    "googleId",
                    "facebookId",
                    "twitterId",
                ],
            },
        },
        scopes: {
            withPassword: {
                attributes: {
                    include: ["password"],
                },
            },
            withRefreshToken: {
                attributes: {
                    include: ["refreshToken"],
                },
            },
            withEmailVerifyToken: {
                attributes: {
                    include: ["emailVerifyToken"],
                },
            },
        },
    }
)

Parents.hasMany(Kid)

module.exports = Parents
