const {Diagnoses} = require('../sequelize/models/diagnose');
const {Counsels} = require('../sequelize/models/counsel');

// upload하고 counsel에 isDiagnose 업데이트
// 하나만 하지 않는다.
async function uploadDiagnose(filePath, counselId){
    try{
        console.log(11111);
        await Counsels.update(
            { isDiagnosed:true },
            {
              where: {
                id:counselId
              },
            },
        );
        console.log(222222);
        await Diagnoses.create({
            counselId:counselId,
            path:filePath
        });

        return {result:0};
    }catch(err){
        console.error(err);
        return {result:2, message:err};
    }
}

module.exports = uploadDiagnose;