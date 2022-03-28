const { DataTypes } = require('sequelize');
const config = require('../src/config/config');
const db = require('./dbInitialise');

db.initialize();
// define article model
const User = config.connection.define("users", {
    uid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },    
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        isEmail: true
    },
    fullname: config.Sequelize.STRING,
    dob: config.Sequelize.DATE,
    isAdmin: config.Sequelize.BOOLEAN
});

const Country = config.connection.define("country", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: config.Sequelize.STRING
    },
    code: {
        type: config.Sequelize.STRING
    },
    dial_code: {
        type: config.Sequelize.STRING
    }
});

const States = config.connection.define("state", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    code: {
        type: config.Sequelize.STRING
    },
    name: {
        type: config.Sequelize.STRING
    }
});

const Cities = config.connection.define("city", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: config.Sequelize.STRING
    }
});
const Order = config.connection.define("order", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    place: {
        type: config.Sequelize.STRING
    },
});

const Item = config.connection.define("item", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: config.Sequelize.STRING
    },
    specification: {
        type: config.Sequelize.STRING
    },
    price: {
        type: config.Sequelize.STRING
    },
});
config.connection.sync();

States.belongsTo(Country);
Cities.belongsTo(States);
User.belongsTo(Cities);
Order.belongsTo(User);
Order.belongsTo(Item)

module.exports = {
    User,
    Country,
    States,
    Cities,
    Order
};