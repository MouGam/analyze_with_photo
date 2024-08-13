import { StyleSheet, Text, View, Button, TextInput, Dimensions, Alert, ScrollView } from 'react-native';
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
        flex:10,
        borderColor:'black',
        borderWidth:1,
        marginBottom:screenHeight*0.05,
        justifyContent:'space-between'
    },
    conversationWarpper:{

    },
    buttons:{
        flexDirection:'row',

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
    },
    inputChat:{
        height:screenHeight*0.07,
        // width:screenWidth*0.5,
        flex:3,
        borderWidth:1,
        borderColor:'black',
        borderRadius:5,
        marginVertical:10,
        paddingLeft:10,
        paddingVertical:10,
        fontSize:screenHeight*0.035
    },
    buttonsWarpper:{

    }
});

export default style;