import { Sequelize } from "sequelize"
import db from '../config/Database.js'

const {DataTypes} = Sequelize;

const Kids = db.define('kids', {
    uuid: {
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4 
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM('male', 'female'),
        allowNull: false
    },
    level: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    experience: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    last_login: {
        type: DataTypes.DATE
    },
    x_coordinate: {
        type: DataTypes.DOUBLE
    },
    y_coordinate: {
        type: DataTypes.DOUBLE
    },
    refreshToken: {
        type: DataTypes.STRING
    },
}, {
    freezeTableName: true,
    defaultScope: {
        attributes: {
            exclude: ['password', 'emailVerifyToken']
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

export default Kids