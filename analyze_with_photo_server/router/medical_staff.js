const {verification} = require('../communicateWithSequelize/verification');
const uploadCounsel = require('../communicateWithSequelize/uploadCounsel');
const uploadDiagnose = require('../communicateWithSequelize/uploadDiagnose');
const getCounsels = require('../communicateWithSequelize/getCounsels');
const getPrivacy = require('../communicateWithSequelize/getPrivacy');

const writeJsonFile = require('../functions/saveDataInJson');
const getCounselFromFolder = require('../functions/getCounselFromFolder');

const express = require('express');

const router = express.Router();

// 사용자 검증
router.use(async(req, res, next)=>{
    try{
        const iden = req.body.identification;
        const verify = await verification({email:iden.email, password:iden.password});

        if(verify.result === 0){
            res.locals.userId = verify.data.id;
            next();
        }else{
            res.json(verify);
        }
    }catch(err){
        console.error(err);
        res.json({result:2, message:verify.message});
    }
});

// 저장된 counsels 전부 보내주기
// 개정 필요 - url명 고치기, 정리해서 middleware로 따로 저장
router.post('/requestCounsels', async(req, res, next)=>{
    try{
        const counselList  = await getCounsels();
        const _counselList = await getCounselFromFolder(counselList);
        res.json({result:0, data:{counselList:_counselList}});
    }catch(err){
        console.error(err);
        res.json({result:2, message:err});
    }
});

router.post('/requestPrevCounsels', async(req, res, next)=>{
    try{
        const patientId = req.body.data.patientId;
        const prevCounselList  = await getCounsels(patientId);
        const _prevCounselList = await getCounselFromFolder(prevCounselList);

        const privacy = await getPrivacy(patientId);
        
        res.json({result:0, data:{prevCounselList:_prevCounselList, privacy:privacy}});
    }catch(err){
        console.error(err);
        res.json({result:2, message:err});
    }
});

router.post('/submitDiagnose', async(req, res, next) => {
    try{
        const filename = await writeJsonFile("diagnoses", req.body.data.diagnose);
        const result = await uploadDiagnose(filename, req.body.data.counselId);
        res.json(result);
    }catch(err){
        console.error(err);
        res.json({result:2, message:err});
    }
});

module.exports = router;