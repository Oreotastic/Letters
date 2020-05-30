import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import {CircularProgress, Tabs, Tab} from '@material-ui/core'
import SentReceived from './SentReceived'
import axios from 'axios'

const Profile = ({user}) => {

  const [sent, setSent] = useState([])
  const [received, setReceived] = useState([])

  useEffect(() => {
    const prog = document.querySelector('.progress-circle')
    prog.classList.remove('hidden')
    if(user !== '') {
      const promises = [
        axios.get(`/api/sentThreads/${user.id}`),
        axios.get(`/api/receivedThreads/${user.id}`)
      ]

      Promise.all(promises)
      .then(response => {
        setSent(response[0].data)
        setReceived(response[1].data)
      })
      .then(() => {
        prog.classList.toggle('hidden')
      })
    }
  }, [])

  return (
    <div>
      <h2>Welcome {user.name}</h2>
      <div>
        <CircularProgress className="progress-circle hidden"/>      
        <SentReceived received={received} sent={sent}/>
      </div>
    </div>
  )
}

export default Profile