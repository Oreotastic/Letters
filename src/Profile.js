import React, {useState, useEffect} from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import axios from 'axios'

const Profile = ({user}) => {

  const [sent, setSent] = useState([])
  const [received, setReceived] = useState([])

  useEffect(() => {
    if(user !== '') {
      const promises = [
        axios.get(`/api/sentThreads/${user.id}`),
        axios.get(`/api/receivedThreads/${user.id}`)
      ]

      Promise.all(promises).then(response => {
        setSent(response[0].data)
        setReceived(response[1].data)
      })
    }
  }, [])

  return (
    <div>
      <h2>Welcome {user.name}</h2>
      <ul>
        <div>
          <h5>Started</h5>
          {
            sent.map(thread => {
                return (
                  <Link to={`/thread/${thread.id}`}>
                    <li key={thread.id}>
                      <p>
                        {thread.msgs[thread.msgs.length-1].reply}
                      </p>
                    </li>
                  </Link>
                )
            })
          }
        </div>
        <div>
          <h5>Recieved</h5>
          {
            received.map(thread => {
                return (
                  <Link to={`/thread/${thread.id}`}>
                    <li key={thread.id}>
                      <p>
                        {thread.msgs[thread.msgs.length-1].reply}
                      </p>
                    </li>
                  </Link>
                )
            })
          }
        </div>
      </ul>
     
    </div>
  )
  
}

export default Profile