import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Letter from './Letter'

const Replies = ({user, createReply, myLetter, setMyLetter}) => {

  const [msgs, setMsgs] = useState([])
  const {id} = useParams()
  
  useEffect(() => {
    axios.get(`/api/threads/${id}`)
      .then(response => setMsgs(response.data.msgs))
  }, [])

  return (
    <div>
      <div className="thread-container">
        <ul>
          {
            msgs.map(reply => {
              console.log(reply, user)     
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
        <Letter />
      </div>
    </div>
  )
}

export default Replies