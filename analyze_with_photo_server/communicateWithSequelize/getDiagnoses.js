const {Diagnoses} = require("../sequelize/models/diagnose");
const path = require("path");

// userId 값 안넣으면 전부 반환
// 넣으면 해당 id에 해당하는 counsel들만 리턴
async function getDiagnoses(counselId){

    //for debugging
    console.log(counselId);
    const diagnoseList = await Diagnoses.findAll({where:{ counselId : counselId }});
    for(let i=0;i<diagnoseList.length;i++)
        diagnoseList[i].dataValues.path = path.join(__dirname, "..", "diagnoses", diagnoseList[i].dataValues.path)
    //for debugging
    console.log(diagnoseList);
    return diagnoseList;
}

module.exports = getDiagnoses;