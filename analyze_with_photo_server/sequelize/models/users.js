const Sequelize = require('sequelize');

class Users extends Sequelize.Model{
    static initiate(sequelize){
        Users.init({
            email:{
                type:Sequelize.STRING,
                allowNull:false,
                unique:true
            },
            name:{
                type:Sequelize.STRING,
                allowNull:false,
                unique:false
            },
            password:{
                type:Sequelize.TEXT,
                allowNull:false,
                unique:false
            },
            //생년월일로 수정
            birth:{
                type:Sequelize.DATEONLY,
                allowNull:false,
                unique:false
            },
            phone:{
                type:Sequelize.STRING,
                allowNull:false,
                unique:true
            },
            gender:{
                type:Sequelize.ENUM('male', 'female'),
                allowNull:false,
                unique:false
            },
            role:{
                type:Sequelize.ENUM('patient', 'medical_staff'),
                allowNull:false,
                unique:false
            }
        },{
            sequelize,
            timestamps:true,
            underscored:false,
            modelName:'Users',
            tableName:'users',
            paranoid:true,
            charset:'utf8',
            collate:'utf8_general_ci',
        })
    }

    static associate(db){
        db.Users.hasMany(db.Counsels);
    }
}

module.exports = {Users};