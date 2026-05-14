"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
exports.UserModel = UserModel;
const sequelize_1 = require("sequelize");
const role_1 = require("_helpers/role");
class User extends sequelize_1.Model {
}
exports.User = User;
function UserModel(sequelize) {
    User.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        firstName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        role: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(role_1.Role)),
            allowNull: false,
            defaultValue: role_1.Role.User
        },
        passwordHash: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        verified: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        sequelize,
        tableName: 'users',
        defaultScope: {
            attributes: { exclude: ['passwordHash'] }
        },
        scopes: {
            withPassword: {
                attributes: { include: ['passwordHash'] }
            }
        }
    });
    return User;
}
