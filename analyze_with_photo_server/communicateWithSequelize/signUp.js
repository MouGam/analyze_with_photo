const {Users} = require('../sequelize/models/users');
// const {Op} = require('sequelize');

const checkEmail = async (req, res, next)=>{
    try{
        // console.log(req.body);
        const checkMail = await Users.findOne({ where: { email: req.body.data.email } });;
        
        //db에 동일 데이터 있음
        if(checkMail !== null){
            res.json({result:1, message:'EMAILEXIST'});
        }
        //db에 동일 데이터 없음->진행시켜
        else{
            next();
        }
    }catch(err){
        console.error(err);
        res.json({result:2, message:'ERRINCHECKEMAIL'});
    }
}

const signUp = async (req, res, next)=>{
    try{
        const data = req.body.data;
        console.log(data);
        await Users.create(data);
        res.json({result:0});
    }catch(err){
        console.error(err);
        res.json({result:2, message:'FAILTOENROLL'});
    }
}   

module.exports = {signUp, checkEmail}