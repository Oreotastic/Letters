import React, {useState, useEffect} from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import axios from 'axios'

const Profile = ({setReplies, user, replies}) => {

  useEffect(() => {
    if(user !== '') {
      axios.get(`/api/replies/${user.id}`)
        .then(response => setReplies(response.data))
    }
  }, [])

  return (
    <div>
      <h2>Welcome {user.name}</h2>
      <ul>
        {
          replies.map(reply => {
            console.log(reply)
            
            return (
              <Link to={`/thread/${reply.threadid}`}>
                <li key={reply.id}>
                  <p>
                    {reply.replymsg}
                  </p>
                </li>
              </Link>
            )
          })
        }
      </ul>
     
    </div>
  )
  
}

export default Profile