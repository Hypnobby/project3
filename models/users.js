const bcrypt = require("bcrypt");

module.exports = (sequelize, DataType) => {
    const Users = sequelize.define("Users", {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        password: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
         email: {
            type: DataType.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        }
    }, {
        hooks: {
            beforeCreate: user => {
                const salt = bcrypt.genSaltSync();
                user.password = bcrypt.hashSync(user.password, salt);
            },
            beforeUpdate: (user) => {
                if (user.changed('password')) {
                    const salt = bcrypt.genSaltSync();
                    user.password = bcrypt.hashSync(user.password, salt);
                }
            }
        },
        classMethods: {
            associate: (models) => {
                Users.hasMany(models.Items, { as: 'Items' });
            },
            isPassword: (encodedPassword, password) => {
                return bcrypt.compareSync(password, encodedPassword);
            }
        }
    });
    return Users;
};