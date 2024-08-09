const Sequelize = require('sequelize');

class Diagnoses extends Sequelize.Model{
    static initiate(sequelize){
        Diagnoses.init({
            path:{
                type:Sequelize.STRING,
                allowNull:false,
                unique:true
            }
        },{
            sequelize,
            timestamps:true,
            underscored:false,
            modelName:'Diagnoses',
            tableName:'diagnoses',
            paranoid:true,
            charset:'utf8',
            collate:'utf8_general_ci',
        })
    }

    static associate(db){
        db.Diagnoses.belongsTo(db.Counsels, {foreignKey:'counselId'});
    }
}

module.exports = {Diagnoses};