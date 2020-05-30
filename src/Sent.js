import React from 'react'
import {Link} from 'react-router-dom'
import {Button} from '@material-ui/core'

const Sent = ({sent}) => {

  return (
    <ul className="myThreads">
      {
        sent.map(thread => { 
          return (
            <li key={thread.id}>
              <Link to={`/thread/${thread.id}`}>
                <Button variant="contained" color="secondary" className="myThread">
                  {thread.msgs[thread.msgs.length-1].reply.substring(0, 41)}
                </Button>
              </Link>
            </li>
          )
        })
      }
    </ul>
  )
}

export default Sent