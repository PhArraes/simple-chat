import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import  schat from './socket/chat';
import TextField from '@material-ui/core/TextField';



function App() {
  const [chat, setMessage] = useState({message : ''});
  const [text, setText] = useState('');
  function setM(chatM) {
    setMessage({message: `${chatM.message}\n${chat.message}`});
  }
  function keyUp(props){
    if(props.keyCode === 13){
      schat.send(text);
      setText('');
    }
  }
  function change(props){
      setText(props.target.value);
  }
  schat.subscribeToChat('text',setM);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      <TextField
          fullHeight
          fullWidth
          id="outlined-multiline-static"
          label="Chat"
          multiline
          rows={20}
          defaultValue={chat.message}
          value={chat.message}
          variant="filled"
        />
         <TextField
          fullWidth
          id="outlined-multiline-static"
          label="Message"
          variant="filled"
          value={text}
          onChange={(props) => {change(props)}}
          onKeyUp={(props) => {keyUp(props)}}
        />
      </header>

    </div>
  );
}

export default App;
