import React, { useEffect, useState } from 'react'
import axios from 'axios'
import socketIOClient from 'socket.io-client'
import { useParams } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress'
import Letter from './Letter'
 
const Replies = ({msgs, setMsgs, user, updateThread, myLetter, setMyLetter}) => {

  const {id} = useParams()

  const ENDPOINT = 'http://hidden-basin-38095.herokuapp.com/'
  const [room, setRoom] = useState('')

  useEffect(() => {
    const prog = document.querySelector('.progress-circle')
    prog.classList.remove('hidden')
    axios.get(`/api/threads/${id}`)
      .then(response => {
        prog.classList.toggle('hidden')
        setMsgs(response.data.msgs)
      })
  }, [])

  useEffect(() => {
    axios.get(`/api/threads/${id}`)
      .then(response => {
        setRoom(`/${response.data.sender}-${response.data.receiver}`)
      })
  }, [])

  const socket = socketIOClient(ENDPOINT)
  socket.emit('jointhread', room)
  socket.on('jointhread', (data) => {
    console.log(data)
  })

  socket.on('chat message', (room, msg, userId) => {
    if(userId !== user.id) {
      console.log(room, msg, userId, 'this should be on the browser')
      setMsgs([...msgs, {userId: userId, reply: msg}])
      const messageBody = document.querySelector('.thread-container ul');
      messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

    }
  })

  const socketEmit = (msg) => {
    if(msg !== '') {
      const socket = socketIOClient(ENDPOINT)
      socket.emit('chat message', room, msg, user.id)
    }
  }



  return (
    <div>
      <div className="thread-container">
        <ul>
        <CircularProgress className="progress-circle hidden"/>
          {
            msgs.map(reply => { 
              const prevMsg = msgs[msgs.indexOf(reply)-1]
              return (
                <div className={user.id === reply.userId ? `reply-container reciever` : `reply-container sender`}>
                    <p className="reply" >{reply.reply}</p>
                </div>
              )         
            })
          }
          <li id="anchor"></li>
        </ul>
      </div>
      
      <div className="msg-box">
        <Letter myLetter={myLetter} setMyLetter={setMyLetter}/>
        <img className="icon paper" id="sendReply" src="https://i.imgur.com/2MT34wZ.png" alt="paper" onClick={() => {
          updateThread(id, user.id, myLetter)
          socketEmit(myLetter)
        }}/>
      </div>
    </div>
  )
}

export default Replies