const fs = require("fs");

async function getDiagnosesFromFolder(diagnoseList){
    diagnoseList.forEach(async (_, idx)=>{
        let diagnose = fs.readFileSync(diagnoseList[idx].dataValues.path, 'utf-8');
        diagnose = JSON.parse(diagnose);
        diagnoseList[idx].dataValues.diagnose = diagnose;
        diagnoseList[idx].dataValues.path = null;
    });

    // console.log(counselList);
    return diagnoseList;
}

module.exports = getDiagnosesFromFolder;