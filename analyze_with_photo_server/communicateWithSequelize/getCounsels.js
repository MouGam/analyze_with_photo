const {Counsels} = require("../sequelize/models/counsel");
const path = require("path");

// userId 값 안넣으면 전부 반환
// 넣으면 해당 id에 해당하는 counsel들만 리턴
async function getCounsels(userId){

    const counselsList = userId == undefined ? 
        await Counsels.findAll(): await Counsels.findAll({where:{ userId : userId }});
    for(let i=0;i<counselsList.length;i++)
        counselsList[i].dataValues.path = path.join(__dirname, "..", "counsels", counselsList[i].dataValues.path)

    return counselsList;
}

module.exports = getCounsels;