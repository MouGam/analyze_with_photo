import { StyleSheet, Text, View, Button, Dimensions,ScrollView, Alert, Image }  from 'react-native';
import { useEffect, useState } from 'react';
import globalStyle from '../globalStyle.js';
import style from '../styles.js';
const {width:screenWidth, height:screenHeight} = Dimensions.get('window');

// const style = StyleSheet.create({
//     navBar:{
//         flex:1
//     },
//     title:{
//         flex:1,
//         textAlign:'center'
//     },
//     chattingBox:{
//         flex:12,
//         borderColor:'black',
//         borderWidth:1,
//         marginBottom:screenHeight*0.05,
//         justifyContent:'space-between'
//     },
//     conversationWarpper:{

//     },
//     innerChatting:{
//         flexDirection:'column',
//         borderColor:'black',
//         borderWidth:1,
//         padding:5,
//         margin:5
//     },
//     innerChattingBot:{
//         textAlign:'left'
        
//     },
//     innerChattingUser:{
//         textAlign:'right'
//     },
    
//     userChattingWarpper:{
//         flexDirection:'row',
//         alignItems:'center',
//         margin:5
//     },
//     chattingText:{
//         fontSize:30,
//         borderColor:'black',
//         borderWidth:1,
//         padding:5,
//         margin:5
//     }
// });

export default function PrevDetail({navigation, route}){
    const data = route.params.data;
    const counsel = data.counsel;
    const [convList, setConvList] = useState([]);

    useEffect(()=>{
        // console.log(data)
        setConvList(counsel.conversation);
    }, []);

    return(<View style={globalStyle.container}>
        <Button 
        title='이전페이지로' 
        onPress={()=>{
            navigation.goBack();
        }}/>

<Text>대화내역</Text>
        <ScrollView style={style.conversationWarpper}>
            {/* 이 범위 안쪽에서 스크롤 가능하도록 */}
            {conversation.map((e, idx)=>{
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
    </View>);
}