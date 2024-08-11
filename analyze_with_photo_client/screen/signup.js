import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import {useState, useEffect} from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { setReduxEmail, setReduxPassword } from '../redux/setInformation';

import sendToServer from '../functions/communicateWithServer';

import globalStyle from './globalStyle';

const style = StyleSheet.create({
    titleContainer:{

    },
    title:{

    },

    formContainer:{

    }
});

export default function SignUp({navigation}){
    const [role, setRole] = useState(null);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const [gender, setGender] = useState(null);

    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [date, setDate] = useState('');
    
    const dispatch = useDispatch();

    const handleSubmit = async ()=>{
        const birth = new Date(`${year}-${month}-${date}`);
        const data = {
            role:role,
            gender:gender,
            email:email,
            password:password,
            name:name,
            phone:phone,
            birth:birth
        };
        const res = await sendToServer('signup', null, data);

        //동일 이메일이 존재하지 않음
        if(res.result === 0){
            await dispatch(setReduxEmail({email:email}));
            await dispatch(setReduxPassword({password:password}));
            Alert.alert(
                '회원가입이 완료되었습니다.',
                '확인을 누르면 다음 페이지로 이동합니다.',
                [
                    {text:'확인', 
                    onPress:()=>
                        navigation.navigate(role === "patient" ? 'patient' : 'medicalstaff', {restart:true})
                    }
                ]
            );
        }
        //동일 이메일이 존재함
        else if(res.result === 1){
            if(res.message === 'EMAILEXIST'){
                Alert.alert(
                    '동일한 이메일이 존재합니다.',
                    '다른 이메일로 다시 시도하세요',
                    [
                        {text:'확인', onPress:()=>{}}
                    ]
                );
            }
        }
        else{
            console.error(res.message);
            Alert.alert(
                '오류가 발생했습니다',
                '다시 시도해주세요',
                [
                    {text:'확인', onPress:()=>{}}
                ]
            )
        }
    }

    return(<View style={globalStyle.container}>
        
        <View style={style.titleContainer}>
            <Text style={style.title}>회원가입</Text>
        </View>

        <View>
        <Button
                style={style.button}
                title='로그인 페이지로 이동'
                onPress={()=>{
                    navigation.navigate('login');
                }}
            />
        </View>

        <View>
            <Text>
                {role} 정보기입
            </Text>

            <Button
                style={style.button}
                title='환자'
                onPress={()=>{
                    setRole('patient');
                }}
            />
            <Button
                style={style.Button}
                title='의료진'
                onPress={()=>{
                    setRole('medical_staff');
                }}
            />

            <Text>{gender}</Text>
            <Button
                style={style.button}
                title='남성'
                onPress={()=>{
                    setGender('male');
                }}
            />
            <Button
                style={style.Button}
                title='여성'
                onPress={()=>{
                    setGender('female');
                }}
            />
            
            {/* 이메일 */}
            <TextInput id={'email'} value={email} placeholder={'이메일'} onChangeText={(value)=>{setEmail(value)}} autoCapitalize='none'/>
            {/* 이름 */}
            <TextInput id={'name'} value={name} placeholder={'이름'} onChangeText={(value)=>setName(value)} autoCapitalize='none'/>
            {/* 비밀번호 */}
            <TextInput id={'password'} value={password} placeholder={'비밀번호'} onChangeText={(value)=>setPassword(value)} secureTextEntry={true} autoCapitalize='none'/>
            {/* 전화번호 */}
            <TextInput id={'phone'} value={phone} placeholder={'전화번호'} onChangeText={(value)=>{setPhone(value)}} autoCapitalize='none'/>
            {/* 생년월일 */}
            <View style={{flexDirection:'row'}}>
                <TextInput id={'year'} placeholder={'생년'} value={year} onChangeText={(value)=>setYear(value)}/>
                <TextInput id={'month'} placeholder={'월'} value={month} onChangeText={(value)=>setMonth(value)}/>
                <TextInput id={'date'} placeholder={'일'} value={date} onChangeText={(value)=>setDate(value)}/>
            </View>

            <Button
            style={style.Button}
            title='완료'
            onPress={handleSubmit}
            />
        </View> 
    </View>);
}