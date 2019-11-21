const Sequelize=require('sequelize');
const db=require('../db');

const Team=db.define('team', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
})


module.exports=Team;