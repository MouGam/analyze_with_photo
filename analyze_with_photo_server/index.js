const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const signupRouter = require('./router/signUp');
const loginRouter = require('./router/login');

const patientRouter = require('./router/patient');
const medicalStaffRouter = require('./router/medical_staff');

const {sequelize} = require('./sequelize/index');

sequelize.sync({force:false})
.then(()=>{
    console.log('db연결 성공');
})
.catch((err)=>{
    console.error('db연결 실패: ', err);
});

const app = express();
const port = 3000;

//cors 미들웨어는 같은네트워크 안에서 동작할때만
app.use(cors());
app.use(express.json());

app.use(morgan('dev'));

app.get('/', (req, res, next)=>{
    res.send('ok');
});

app.use('/signup', signupRouter);
app.use('/login', loginRouter);

app.use('/patient', patientRouter);
app.use('/medical_staff', medicalStaffRouter);

//오류
app.use((req, res)=>{
    console.error('에러');
    res.send({status:'error'});
});

app.listen(port, ()=>{
    console.log(`예시 앱 ${port}번 포트에서 동작중`);
});