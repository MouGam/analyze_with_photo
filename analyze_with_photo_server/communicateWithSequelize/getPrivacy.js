const {Users} = require('../sequelize/models/users');

const getPrivacy = async (userId)=>{
    try{
        const checkMail = await Users.findOne({ where: { id: userId}, attributes:['name', 'birth', 'gender', 'role'] });
        
        return checkMail.dataValues;
    }catch(err){
        console.error(err);
        return err;
    }
}

module.exports = getPrivacy