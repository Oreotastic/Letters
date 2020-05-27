import React, { useEffect, useState } from 'react'
import axios from 'axios'
import socketIOClient from 'socket.io-client'
import { useParams } from 'react-router-dom'
import Letter from './Letter'

const Replies = ({setRoom, room, msgs, setMsgs, user, updateThread, myLetter, setMyLetter}) => {

  const {id} = useParams()

  const ENDPOINT = 'http://localhost:3000/'

  
  useEffect(() => {
    axios.get(`/api/threads/${id}`)
      .then(response => setMsgs(response.data.msgs))
  }, [])

  useEffect(() => {
    axios.get(`/api/threads/${id}`)
      .then(response => {
        setRoom(`/${response.data.sender}-${response.data.receiver}`)
      })
  }, [])


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
          {
            msgs.map(reply => { 
              const prevMsg = msgs[msgs.indexOf(reply)-1]
              
              return (
                <div className={user.id === reply.userId ? `reply-container reciever` : `reply-container sender`}>
                  <li className="thread-list">
                    <p className="reply" >{reply.reply}</p>
                  </li>
                </div>
              )         
            })
          }
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