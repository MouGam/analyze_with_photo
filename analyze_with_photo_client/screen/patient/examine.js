import { StyleSheet, Text, View, Button, TextInput, Dimensions, Alert, ScrollView } from 'react-native';
import {useState, useEffect, useRef} from 'react';
import { useSelector } from 'react-redux';

import OpenAI from "openai";

import {OPENAI_API_KEY, OPENAI_MODEL} from "@env";

import sendToServer from "../../functions/communicateWithServer";

import globalStyle from '../globalStyle';

const {width:screenWidth, height:screenHeight} = Dimensions.get('window');

const style = StyleSheet.create({
    navBar:{
        flex:1
    },
    title:{
        flex:1,
        textAlign:'center'
    },
    chattingBox:{
        flex:12,
        borderColor:'black',
        borderWidth:1,
        marginBottom:screenHeight*0.05,
        justifyContent:'space-between'
    },
    conversationWarpper:{

    },
    innerChatting:{
        flexDirection:'column',
        borderColor:'black',
        borderWidth:1,
        padding:5,
        margin:5
    },
    innerChattingBot:{
        textAlign:'left'
        
    },
    innerChattingUser:{
        textAlign:'right'
    },
    
    userChattingWarpper:{
        flexDirection:'row',
        alignItems:'center',
        margin:5
    },
    chattingText:{
        fontSize:30,
        borderColor:'black',
        borderWidth:1,
        padding:5,
        margin:5
    }
});

export default function Examine({navigation}){

    console.log(`openai API key: ${OPENAI_API_KEY.substring(0, 10)}...`)
    //각 대화의 배열을 저장하는 state
    const [convList, setConvList] = useState([]);

    const [userText, setUserText] = useState('');

    const userInfo = useSelector(state=>state.setInformation);

    const chatRef = useRef(null);

    const openai = new OpenAI({
        apiKey:OPENAI_API_KEY
    });

    const openai_chat_start = async ()=>{
        const systemContent = "You are a specialist doctor at a general hospital who reviews photos of the affected area uploaded by patients, analyzes their symptoms, and recommends which hospital to visit and what treatment to receive." + 
        "You are a chatbot doctor treating patients at a general hospital. Provide clear and positive responses based on the patient's symptoms, and respond concisely to ensure the conversation is easy to understand. First, ask the patient what symptoms they have, and then proceed with the diagnosis following the general protocol used by doctors. When asking the patient questions, ask only one question at a time. Do not inform the patient of any suspected diseases or diagnoses in the first response; instead, provide information about the suspected diseases and diagnoses after obtaining sufficient answers about the patient's symptoms. During the diagnosis, you may request a photo of the affected area for a more detailed examination. Help decide and implement the best treatment methods based on the diagnosis results. Respond in one sentence whenever possible. If the patient asks about a specific medication, provide information about that medication. At the end, guide the patient on which department of the hospital to visit." + 
        "And, You need to speek korean.";
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: systemContent }],
            model: OPENAI_MODEL,
          });
        
        // console.log(completion.choices[0].message);
        // return completion.choices[0].message;
        setConvList([{ role: "system", content: systemContent }, completion.choices[0].message]);
    }

    const openai_chat = async (chatList)=>{
        const completion = await openai.chat.completions.create({
            messages: chatList,
            model: OPENAI_MODEL,
          });
        
        return completion.choices[0].message;
        // console.log(completion);
    }
    //사용자가 채팅 입력하면 작동하는 함수
    //1. 채팅 내용을 대회내역에 저장 ->()  convList에 저장)
    //2. 채팅이 화면에 표시되고
    //3. gpt에 전송
    const userChat = async (text, convList)=>{
        if(text === '')
            return;
        else if(text ==='end')
            return conversationEnd();
        convList.push({role:'user', content:text});

        const gptchat = await openai_chat(convList);

        setConvList(e=>[...e, gptchat]);
    }


    const conversationEnd = async ()=>{
        Alert.alert(
            title='대화를 제출하시겠습니까?',
            message='대화의 내용에 따라 제출이 거부될 수 있습니다.',
            buttons=[
                {text:'네', onPress: async ()=>{
                    const identification ={
                        email:userInfo.email,
                        password:userInfo.password
                    }
                    const data = {
                        conversation:convList
                    };
                    const res = await sendToServer("patient/examine", identification, data);
                    
                    // 성공시 창 이동
                    if(res.result === 0)
                        navigation.navigate('patient', {restart:true });
                    // 실패나 에러 발생시
                    else{
                        console.error(res.message);
                    }
                }},
                {text:'아니오', onPress:()=>{chatRef.current.focus();}},
            ]
        )
    }

    useEffect(()=>{
        openai_chat_start();
    }, []);

    return(<View style={globalStyle.container}>
        <Button
        style={style.navBar}
        title='환자 메인 창으로' 
        onPress={()=>{
            navigation.navigate('patient', {restart:false});
        }}/>

        <Text style={style.title}>
            상담 창
        </Text>

        {/* 채팅 올라오는곳과 치는 부분 합친 박스 */}
        <View style={style.chattingBox}>

            {/* 모든 채팅이 올라오는 곳 */}
            <ScrollView style={style.conversationWarpper}>
                {/* 이 범위 안쪽에서 스크롤 가능하도록 */}
                {convList.map((e, idx)=>{
                    // system은 배제하도록 함
                    if(e.role === 'user'){
                        return (<View style={style.innerChatting} key={idx}>
                            <Text style={style.innerChattingUser}>
                                {e.content}
                            </Text>
                        </View>);
                    }else if(e.role === 'assistant'){
                        return (<View style={style.innerChatting} key={idx}>
                            <Text style={style.innerChattingBot}>
                                {e.content}
                            </Text>
                        </View>);
                    }
                })}
            </ScrollView>

            {/* 유저가 채팅 치는 부분 */}
            <View style={style.userChattingWarpper}>
                <TextInput 
                    style={globalStyle.input} 
                    onChangeText={
                        (event)=>{
                            setUserText(event);
                        }
                    }
                    onSubmitEditing={()=>{
                        userChat(userText, convList);
                        setUserText('');
                    }}
                    value={userText}
                    ref={chatRef}
                    blurOnSubmit={false}
                    autoCapitalize={'none'}
                />
                <Button 
                    // 채팅 치면?
                    onPress={()=>{
                        userChat(userText, convList);
                        setUserText('');
                    }}
                    style={style.chatSendButton}
                    title={'전송'}
                />
            </View>
        </View>

        <Button
        onPress={()=>{
            conversationEnd();
        }}
        style={style.chatSendButton}
        title={'제출하기'}/>

    </View>);
}