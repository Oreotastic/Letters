import React from 'react'
import {Link} from 'react-router-dom'

const Sent = ({sent}) => {

  return (
    <ul>
      {
        sent.map(thread => { 
          return (
            <Link key={thread.id} to={`/thread/${thread.id}`}>
              <li>
                <p>
                  {thread.msgs[thread.msgs.length-1].reply}
                </p>
              </li>
            </Link>
          )
        })
      }
    </ul>
  )
}

export default Sent