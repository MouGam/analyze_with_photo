const fs = require("fs");

async function getCounselFromFolder(counselList){
    counselList.forEach(async (_, idx)=>{
        // counselList[idx].counsel 
        let counsel = fs.readFileSync(counselList[idx].dataValues.path, 'utf-8');
        counsel = JSON.parse(counsel);
        // console.log(counsel);
        counselList[idx].dataValues.counsel = counsel;
        counselList[idx].dataValues.path = null;
        // console.log(counselList[idx]);
    });

    // console.log(counselList);
    return counselList;
}

module.exports = getCounselFromFolder;