import { Sequelize } from "sequelize"
import db from '../config/Database.js'

const {DataTypes} = Sequelize;

const Parents = db.define('parents', {
    uuid: {
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4 
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    emailVerifyToken: {
        type: DataTypes.STRING
    },
    emailVerifiedAt: {
        type: DataTypes.DATE
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    googleId: {
        type: DataTypes.STRING
    },
    facebookId: {
        type: DataTypes.STRING
    },
    twitterId: {
        type: DataTypes.STRING
    },
    refreshToken: {
        type: DataTypes.STRING
    },
    
}, {
    freezeTableName: true,
    defaultScope: {
        attributes: {
            exclude: ['password', 'emailVerifyToken', 'refreshToken']
        }
    },
    scopes: {
        withPassword: {
            attributes: {
                include: ['password']
            }
        }
    }
})

export default Parents