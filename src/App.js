import React, {useState, useEffect} from 'react';
import {ChatListItem} from './components/ChatListItem/index';
import {ChatIntro} from './components/ChatIntro/index';
import {ChatWindow} from './components/ChatWindow/index';
import {NewChat} from './components/NewChat/index';
import {LoginScreen} from './components/LoginScreen/index';
import {Api} from './api/api'


import './App.css'

import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search'

export function App (){
  const [chatList, setChatList] = useState([]);
  const [activeChat, setActiveChat] = useState({});
  const [user,setUser] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);

  useEffect(()=>{
    if(user!== null){
      let unsub = Api.onChatList(user.id, setChatList);
      return unsub;
    }
  },[user]);

  function handleNewChat(){
    setShowNewChat(true);
  };

  const handleLoginData = async (user) => {
    let newUser = {
      id: user.uid,
      name:user.displayName,
      avatar: user.photoURL
    };
    await Api.addUser(newUser);
    setUser(newUser);
  }

  if (user === null) {
    return (<LoginScreen onReceive={handleLoginData}/>);
  }

  return (
    <div className="app-window">
      <div className="sidebar">
        
        
        <NewChat
          chatlist={chatList}
          user={user}
          show={showNewChat}
          setShow={setShowNewChat}
        />

        <header>
          <img className="header--avatar" src={user.avatar}/>
          <div className="header--buttons">
            <div className="header--btn">
              <DonutLargeIcon style={{color:'#919191'}}/>
            </div>
            <div onClick={handleNewChat} className="header--btn">
              <ChatIcon 
                style={{color:'#919191'}}
                />
            </div>
            <div className="header--btn">
              <MoreVertIcon style={{color:'#919191'}}/>
            </div>
          </div>
        </header>

        <div className="search">
          <div  className="search--input">
            <SearchIcon fontSize="small" style={{color:'#919191'}}/>
            <input type="search" placeholder="Procurar ou começar uma nova conversa"/>
          </div>
        </div>
        <div className="chatlist">
          {chatList.map((item,key)=>(
            <ChatListItem 
            key={key}
            data={item}
            active={activeChat === chatList[key]}
            onClick={()=>setActiveChat(chatList[key])}
            />
          ))}
            
        </div>
      </div>
      <div className="contentarea">
            {activeChat.chatId !== undefined && 
              <ChatWindow
                user={user}
                data={activeChat}
              />
            }
            {activeChat.chatId === undefined && 
              <ChatIntro/>
            }
      </div>
    </div>
  )
}