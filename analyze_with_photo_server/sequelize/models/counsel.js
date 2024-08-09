const Sequelize = require('sequelize');

class Counsels extends Sequelize.Model{
    static initiate(sequelize){
        Counsels.init({
            path:{
                type:Sequelize.STRING,
                allowNull:false,
                unique:true
            },
            isDiagnosed:{
                type:Sequelize.BOOLEAN,
                allowNull:false,
            }
        },{
            sequelize,
            timestamps:true,
            underscored:false,
            modelName:'Counsels',
            tableName:'counsels',
            paranoid:true,
            charset:'utf8',
            collate:'utf8_general_ci',
        })
    }

    static associate(db){
        db.Counsels.belongsTo(db.Users, {foreignKey: 'userId'});
        db.Counsels.hasMany(db.Diagnoses);
    }
}

module.exports = {Counsels};