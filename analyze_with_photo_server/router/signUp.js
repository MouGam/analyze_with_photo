//회원가입

//1. 정보 받아서
//2. 겹치는 이메일 없으면 -> 생략
//3. db에 저장

//문제: 앱에서 계속 로그인하려면?
//해결1: 
//앱(클라이언트 측)에 아예 아이디 비밀번호 저장
//이후 다시 앱 실행할 때, 데이터 필요할 때 서버측에 보냄.
//그냥 할때마다 서버측에 다시 로그인 한다고 생각
const express = require('express');

const {signUp, checkEmail} = require('../communicateWithSequelize/signUp');

const router = express.Router();

//db에 등록
//checkEmail에서는 동일한 이메일 존재하는지 체크, singUp에서는 아이디 등록
router.post('/', checkEmail, signUp);

module.exports = router;