module.exports = (sequelize, DataType) => {
    const Items = sequelize.define("Items", {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        itemID: {
            type: DataType.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        itemName: {
            type: DataType.TEXT,
            unique: true,
            allowNull: false,
            unique: {
                msg: 'The item name must be unique.'
            }
        },
        price: {
            type: DataType.DOUBLE, 
            validate: {
                notEmpty: true
            }
        },
        description: {
            type: DataType.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        material: {
            type: DataType.TEXT, 
            allowNull: true 
        },
        creator: {
            type: DataType.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    }, {
        classMethods: {
            associate: (models) => {
                Items.belongsTo(models.Users);
            }
        }
    });
    return Items;
};
