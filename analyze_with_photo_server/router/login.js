//로그인 어떻게 처리?
//아래 verification은 사용자 이메일, 비밀번호 체크해서 제대로 된 사용자인지 확인하는 용도
const {verification} = require('../communicateWithSequelize/verification');

const express = require('express');

const router = express.Router();

//아이디, 비밀번호 검사
router.post('/', async (req, res, next)=>{
    try{
        const iden = req.body.identification;

        const profile = await verification({email:iden.email, password:iden.password});
        
        res.json(profile);
    }
    catch(err){
        console.error(err);
        res.json({result: 2, message:err});
    }
});


module.exports = router;