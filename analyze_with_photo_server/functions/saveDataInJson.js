const fs = require('fs');
const path = require('path');
const uuid = require("uuid");

/* data에 해당하는 js object 데이터를 path에 저장하고 파일 이름을 반환
 */
async function writeJsonFile(PATH, data){
    const name = `${Date.now()}${uuid.v4()}.json`;
    // const conversation = {};
    // data.conversation.forEach((val, idx)=>{
    //     conversation[idx] = val;
    // });

    const dict = JSON.stringify(data);
    const findPath = path.join(__dirname, '..', PATH, name);
    console.log(findPath);
    await fs.writeFile(findPath, dict, 'utf-8', (err)=>{
        if(err) throw new TypeError("File is not created.");
    });

    return name;
}

module.exports = writeJsonFile;