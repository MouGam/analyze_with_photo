const {Users} = require('../sequelize/models/users');
/* 서버와 db서버와의 통신
항상 성공 0 실패 1 오류 2로

클라 서버 통신과 마찬가지로

이용할 때
1. 로그인시
    이메일 존재하지 않을 때
    "EMAILNOTEXIST"
    "PASSWORDNOTMATCH"
    두개 실패 message로 가능


에러 발생시
    try catch시 발생하는 err그대로 message로 넘겨준다.
 */
exports.verification = async function verifiation({email, password}){
    try{
        const profile = await Users.findOne({
            where:{email:email},
            //비밀번호와 환자/의료진여부/고유 id만 가져온다.
            attributes:['password', 'role', 'id']
        });

        // 이메일 존재하지 않을 때
        if(profile === null){
            return {result: 1, message:"EMAILNOTEXIST"};
        }

        // 이메일 존재하고 비밀번호 일치할 때
        if(password === profile.password){
            return {result:0, data: {role: profile.role, id:profile.id} };
        }
        // 이메일 존재하고 비밀번호 일치하지 않을 때(로그인 실패
        else{
            return {result: 1, message:"PASSWORDNOTMATCH"};
        }
    }
    catch(err){
        console.error(err);
        return {result: 2, message:err};
    }
}

//데이터를 요청한 경우
//환자 페이지 ->  환자 받은 상담 리스트 페이지, 환자 진단 상세 페이지
//의료진 페이지-> 환자 정보 리스트, 상담 내역 상세 페이지
