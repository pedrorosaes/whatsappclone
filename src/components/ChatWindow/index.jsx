import { useState, useEffect, useRef } from 'react';

import {MessageItem} from '../MessageItem/index';
import {Api} from '../../api/api';

import SearchIcon from '@material-ui/icons/Search';
import EmojiPicker from 'emoji-picker-react';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVerticon from '@material-ui/icons/MoreVert';
import InserEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';

import './style.css';

export function ChatWindow({user,data}) {
    const [emojiOpen, setEmojiOpen] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [listening, setListening] = useState(false);
    const [list,setList] = useState([]);
    const [users, setUsers] = useState([]);
    const body = useRef();

    let recognition = null;
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition !== undefined){
        recognition = new SpeechRecognition();
    }

    useEffect(()=>{
        setList([]);
        let unsub = Api.onChatContent(data.chatId,setList,setUsers);
        return unsub ;
    },[data.chatId]);

    useEffect(()=>{
        if(body.current.scrollHeight > body.current.offsetHeight) {
            body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight;
        }
    },[list]);

    function handleEmojiClick(event, emojiObject){
        setTextInput(textInput + emojiObject.emoji);
    };
    function handleCloseEmoji (){
        setEmojiOpen(false);
    };
    function handleOpenEmoji (){
        setEmojiOpen(true);
    };
    function handleInputKeyUp(event) {
        if(event.keyCode === 13) {
            handleSendClick();
        }
    }

    function handleSendClick(){
        if(textInput !== '') {
            Api.sendMessage(data, user.id, 'text', textInput, users);
            setTextInput('');
            setEmojiOpen('');
        }
    };
    function handleMicClick(){
        if (recognition !== null) {
            recognition.onstart = () => {
                setListening(true);
            }
            recognition.onend = () => {
                setListening(false);
            }
            recognition.onresult = (event) => {
                setTextInput(event.results[0][0].transcript);
            }
            recognition.start();
        }

    };

    return(
        <div className="chatWindow">
            <div className="chatWindow--header">
                <div className="chatWindow--headerinfo">

                    <img src={data.image} alt="" className="chatWindow--avatar"/>
                    <div className="chatWindow--name">{data.title} {data.chatId}</div>

                </div>
                <div className="chatWindow--headerbuttons">

                    <div className="chatWindow-btn">
                        <SearchIcon style={{color:'#919191'}}/>
                        <AttachFileIcon style={{color:'#919191'}}/>
                        <MoreVerticon style={{color:'#919191'}}/>
                    </div>

                </div>
            </div>
            <div ref={body} className="chatWindow--body">
                {list.map((item,key)=>(
                    <MessageItem 
                        key={key}
                        data={item}
                        user={user}
                    />
                ))}
            </div>
            <div 
                className="chatWindow--emojiarea"
                style={{height:emojiOpen ? '200px' : '0px'}}
            >
                <EmojiPicker

                onEmojiClick={handleEmojiClick}
                disableSearchBar
                disableSkinTonePicker
                />
            </div>

            <div className="chatWindow--footer">
                <div className="chatWindow--pre">

                    <div 
                        className="chatWindow--btn"
                        onClick={handleCloseEmoji}
                        style={{width:emojiOpen?40:0}}
                    
                    >
                        <CloseIcon style={{color:'#919191'}}/>
                    </div>

                    <div 
                        className="chatWindow--btn"
                        onClick={handleOpenEmoji}
                    >
                        <InserEmoticonIcon 
                            style={{color:emojiOpen?'#009688':'#919191'}}

                        />
                    </div>
                </div>
                <div className="chatWindow--inputarea">
                    <input 
                    type="text" 
                    className="chatWindow--input"
                    placeholder="Digite uma mensagem"
                    value={textInput}
                    onChange={e => setTextInput(e.target.value)}
                    onKeyUp={handleInputKeyUp}
                    />
                </div>

                <div className="chatWindow--pos">
                    {textInput.length ?
                        
                    
                        <div 
                        className="chatWindow--btn"
                        onClick={handleSendClick}
                        >
                            <SendIcon style={{color:'#919191'}}/>
                        </div>
                        :
                        <div 
                        className="chatWindow--btn"
                        onClick={handleMicClick}
                        >
                            <MicIcon style={{color:listening?'#126ECE':'#919191'}}/>
                        </div>
                    }
                </div>
            </div>
        </div>
        );
}