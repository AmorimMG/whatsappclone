import React, { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import GifPicker from 'react-twitter-gifpicker';
import Swal from 'sweetalert2';

import './ChatWindow.css';

import Api from '../Api';

import MessageItem from './MessageItem';

import SearchIcon from '@material-ui/icons/Search';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import GifIcon from '@material-ui/icons/Gif';
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';
import LabelIcon from '@material-ui/icons/Label';
import { VisibilityRounded } from '@material-ui/icons';


export default ({user, data}) => {

    const body = useRef();

    let recognition = null;
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(SpeechRecognition !== undefined){
        recognition = new SpeechRecognition();
    }

    const [open, setOpen] = useState(false);
    const [emojiOpen, setEmojiOpen] = useState(false);
    const [text, setText] = useState ('');
    const [listening, setListening] = useState (false);
    const [list, setList] = useState ([]);
    const [users, setUsers] = useState([]);

    function SweetChatAvatar(){
        Swal.fire({
          title: data.title,
          imageUrl: data.image,
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: 'Custom image',
        })
      }

    useEffect(()=>{
        setList([]);
        let unsub = Api.onChatContent(data.chatId, setList, setUsers);
        return unsub;
    }, [data.chatId]);

    useEffect(()=>{
        if(body.current.scrollHeight > body.current.offsetHeight){
            body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight;
        }
    }, [list]);

    const handleEmojiClick = (e, emojiObject) => {
        setText( text + emojiObject.emoji);
    }

    const onPickGif = (gif, e) => {
        console.log(gif);
     setText( text + gif.url); 
    /*  if(gif !== ''){
        Api.sendMessage(data, user.id, 'text', text,gif,users);
        setText('')}  */
    }
    const handleOpenGif = () => {
        setOpen(true);
    }
    const handleCloseGif = () => {
        setOpen(false);
    }
    const handleOpenEmoji = () => {
        setEmojiOpen(true);
    }
    const handleCloseEmoji = () => {
        setEmojiOpen(false);
    }
    const handleMicClick = () => {
        if(recognition !== null) {

            recognition.onstart = () => {
                setListening(true);
            }
            recognition.onend = () => {
                setListening(false);
            }
            recognition.onresult = (e) => {
                setText ( e.results[0][0].transcript );
            }     
            recognition.start();
        }
    }
    const handleInputKeyUp = (e) =>{
        if(e.keyCode == 13){
            handleSendClick();
        }
    }
    const handleSendClick = () => {
        if(text !== ''){
            Api.sendMessage(data, user.id, 'text', text, users);
            setText('');
            setEmojiOpen(false);
        }
    }

    return (
        <div className='chatWindow'>
            <div className="chatWindow--header">

                <div className="chatWindow--headerinfo">
                    <img src={data.image} alt="" onClick={function(){SweetChatAvatar();}} className="chatWindow--avatar" />
                    <div className="chatWindow--name">{data.title}</div>
                </div>

                <div className="chatWindow--headerbuttons">
                    <div className="chatWindow--btn">
                        <SearchIcon style= {{color: '#919191'}} />
                    </div>
                    <div className="chatWindow--btn">
                        <AttachFileIcon style= {{color: '#919191'}} />
                    </div>
                    <div className="chatWindow--btn">
                        <MoreVertIcon style= {{color: '#919191'}} />
                    </div>
                </div>

            </div>
            <div ref={body} className="chatWindow--body">
                {list.map((item,key)=>(
                    <MessageItem
                        key = {key}
                        data = {item}
                        user = {user}
                    />
                ))}
            </div>
            
            <div className="chatWindow--emojiarea" 
            style={{height: emojiOpen ? '200px' : '0px'}}>
            <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    disableSearchBar
                    disableSkinTonePicker
            />
            </div>
            <div className="chatWindow--gifarea"
            style={{height: open ? '200px' : '0px'}}>
            <GifPicker
                api_key={'wE42l5Au3DRu5K7ciJpHYXHdagmroGzN'}
                borderRadius={0}
                columns={4}
                open={open}
                onClose={() => setOpen(false)}
                onGifClick={onPickGif}
                onPickClose={false}
                topBarColor={'#4ADF83'}
            />
            </div>
            <div className="chatWindow--footer">
                <div className="chatWindow--pre">

                <div className="chatWindow--btn" onClick={handleCloseEmoji} style={{width: emojiOpen? 40:0}}>
                    <CloseIcon style= {{color: '#919191'}} />
                </div>
                <div className="chatWindow--btn" onClick={handleOpenEmoji}>
                    <InsertEmoticonIcon style= {{color: emojiOpen?'#009688':'#919191'}} />
                </div>
                <div className="chatWindow--btn">
                    <GifIcon 
                    onClick={() => setOpen(true)}
                    style= {{color: open?'#009688':'#919191'}} 
                    />
                </div>
                <div className="chatWindow--btn">
                    <LabelIcon style= {{color: '#919191'}} />
                </div>
                </div>
                <div className="chatWindow--inputarea">
                    <input className='chatWindow--input'
                            type="text"
                            placeholder='Digite uma mensagem'
                            value={text}
                            onChange={e=>setText(e.target.value)} 
                            onKeyUp={handleInputKeyUp}
                    />
                </div>
                <div className="chatWindow--pos">

                    {text === '' &&
                    <div className="chatWindow--btn">
                    <MicIcon onClick={handleMicClick} style= {{color: listening ? '#126ECE' :'#919191'}} />
                    </div>
                    }
                    {text !== '' && 
                    <div onClick={handleSendClick} className="chatWindow--btn">
                    <SendIcon style= {{color: '#919191'}} />
                    </div>
                    }
                </div>
            </div>
        </div>
    );
 }
