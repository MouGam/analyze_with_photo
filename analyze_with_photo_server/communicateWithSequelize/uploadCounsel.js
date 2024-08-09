const {Counsels} = require('../sequelize/models/counsel');

/* 서버로부터 db서버에 업로드
userId와 filePath를 저장
 */
async function uploadCounsel(filePath,userId){
    try{
        await Counsels.create({
            userId:userId,
            path:filePath,
            isDiagnosed:false
        });
        return {result:0};
    }catch(err){
        console.error(err);
        return {result:2, message:err};
    }
}

module.exports = uploadCounsel;