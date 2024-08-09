const {verification} = require('../communicateWithSequelize/verification');
const uploadCounsel = require('../communicateWithSequelize/uploadCounsel');
const getCounsels = require('../communicateWithSequelize/getCounsels');

const writeJsonFile = require('../functions/saveDataInJson');
const getCounselFromFolder = require('../functions/getCounselFromFolder');

const getDiagnoses = require('../communicateWithSequelize/getDiagnoses');
const getDiagnosesFromFolder = require('../functions/getDiagnosesFromFolder');

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

// db에 path를 저장하고 파일을 저장
router.post('/examine', async(req, res, next)=>{
    try{
        const filename = await writeJsonFile("counsels", req.body.data);
        const result = await uploadCounsel(filename, res.locals.userId);
        res.json(result);
    }catch(err){
        console.error(err);
        res.json({result:2, message:err});
    }
});

router.post('/results', async (req, res, next)=>{
    try{
        let counselList = await getCounsels(res.locals.userId);
        counselList = await getCounselFromFolder(counselList);
        // console.log(counselList[0].dataValues.counsel);
        res.json({result:0, data:{counselList:counselList}});
    }catch(err){
        console.error(err);
        res.json({result:2, message:err});
    }
});

router.post('/getDiagnose', async (req, res, next)=>{
    try{

        let diagnoseList = await getDiagnoses(req.body.data.counselId);
        diagnoseList = await getDiagnosesFromFolder(diagnoseList);

        res.json({result:0, data:{diagnoseList:diagnoseList}})
    }catch(err){
        console.error(err);
        res.json({result:2, message:err});
    }
})

router.post('/aresult', async (req, res, next)=>{
});

module.exports = router;