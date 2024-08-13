import { StyleSheet, Text, View, Button, TextInput, Dimensions, Alert, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import {useState, useEffect, useRef} from 'react';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import OpenAI from "openai";

import {OPENAI_API_KEY, OPENAI_MODEL} from "@env";

import sendToServer from "../../functions/communicateWithServer";

import globalStyle from '../globalStyle';
import style from '../styles';

export default function Examine({navigation}){

    //각 대화의 배열을 저장하는 state
    const [convList, setConvList] = useState([]);

    const [userText, setUserText] = useState('');

    const [image, setImage] = useState(null);

    const userInfo = useSelector(state=>state.setInformation);

    const chatRef = useRef(null);
    const scrollRef = useRef(null);

    const getPhoto = async ()=>{
        const permissionResImage = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResImage.granted === false) {
            alert("사진 접근 권한이 없습니다!");
            return;
        }
        const permissionResCamera = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResCamera.granted === false) {
            alert("사진 접근 권한이 없습니다!");
            return;
        }
        Alert.alert(
            title='촬영 혹은 앨범에서 이미지 선택',
            message='',
            buttons=[
                {text:'촬영', onPress: async ()=>{
                    let result = await ImagePicker.launchCameraAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 1,
                        base64: true,
                    });

                    if (!result.canceled) {
                        setImage(result.assets[0]);
                    }
                }},
                {text:'앨범에서 이미지 선택', onPress:async ()=>{
                    let result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 1,
                        base64: true,
                    });

                    if (!result.canceled) {
                        setImage(result.assets[0]);
                    }
                }},
            ]
        )
        // console.log(result.assets[0].base64);
        /* result(ImagePicker.launchImageLibraryAsync)의 반환값:
        {
            canceled:boolen,
            assets:[
                {
                    "uri", "mimeType", "base64", "duration", "type", "assetId", "fileSize", "exif", "fileName", "width", "height"
                }
            ]
        }
        이중 base64에는 base64방식으로 인코딩된 데이터가 존재함
        */
    };

    const openai = new OpenAI({
        apiKey:OPENAI_API_KEY
    });

    const openai_chat_start = async ()=>{
        const systemContent = "You are a chatbot doctor treating patients at a general hospital. Provide clear and positive responses based on the patient's symptoms, and respond concisely to ensure the conversation is easy to understand. First, ask the patient what symptoms they have, and then proceed with the diagnosis following the general protocol used by doctors. When asking the patient questions, ask only one question at a time. Do not inform the patient of any suspected diseases or diagnoses in the first response; instead, provide information about the suspected diseases and diagnoses after obtaining sufficient answers about the patient's symptoms. During the diagnosis, you may request a photo of the affected area for a more detailed examination. Help decide and implement the best treatment methods based on the diagnosis results. Respond in one sentence whenever possible. If the patient asks about a specific medication, provide information about that medication. Finally, guide the patient on the suspected disease and how to proceed, including which department of the hospital to visit." + 
        "And, When you get photos, "+
        "You are a specialist doctor at a general hospital who reviews photos of the affected area uploaded by patients, analyzes their symptoms, and provides guidance on which hospital to visit and what treatment to receive. If a patient uploads a photo that is not related to their symptoms or condition, you may request them to upload the correct photo. If the patient does not have a photo, proceed with the consultation using only the conversation." + 
        "And, You need to speek korean."
        ;
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
        convList.push({role:'user', content:[{type:"text", text:text}]});

        const gptchat = await openai_chat(convList);

        setConvList(e=>[...e, gptchat]);
    }

    const userChatWithPhoto = async (text, convList, photo)=>{
        if(text ==='end')
            return conversationEnd();
        convList.push({role:'user', content:[
            {type:"text", text:text},
            {type:"image_url",
                image_url:{ "url":`data:image/jpeg;base64,${photo.base64}`}
            },
        ]});

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
        setTimeout(()=>{
            scrollRef.current.scrollToEnd({animated:true});
        }, 500);
    }, [convList]);

    useEffect(()=>{
        openai_chat_start();
        console.log(`openai API key: ${OPENAI_API_KEY}...`)
    }, []);

    return(<KeyboardAvoidingView style={globalStyle.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
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
            <ScrollView style={style.conversationWarpper} ref={scrollRef}>
                {/* 이 범위 안쪽에서 스크롤 가능하도록 */}
                {convList.map((e, idx)=>{
                    scrollRef.current.scrollToEnd({animated:true});
                    // system은 배제하도록 함
                    if(e.role === 'user'){
                        return (<View style={style.innerChatting} key={idx}>
                            <Text style={style.innerChattingUser}>
                                {e.content[0].text}
                            </Text>
                            
                            {e.content[1] ? <Image source={e.content[1].image_url} style={{ width: 200, height: 200 }} /> : null}
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
                    style={style.inputChat} 
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
                <View style={style.buttonsWarpper}>
                    <Button 
                        // 채팅 치면?
                        onPress={()=>{
                            getPhoto();
                        }}
                        style={style.chatSendButton}
                        title={'사진 업로드'}
                    />
                    <Button
                        onPress={async ()=>{
                            if(!image)
                                await userChat(userText, convList);
                            else
                                await userChatWithPhoto(userText, convList, image);
                            setUserText('');
                            setImage(null);
                        }}
                        style={style.chatSendButton}
                        title={'전송'}
                    />
                </View>
            </View>
        </View>
        {image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />}

        <Button
        onPress={()=>{
            conversationEnd();
        }}
        style={style.chatSendButton}
        title={'제출하기'}/>

    </KeyboardAvoidingView>);
}