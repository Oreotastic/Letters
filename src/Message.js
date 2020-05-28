import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

const Message = ({letter}) => {
  return(
    <div id="message">
      <div className="messagebox">
          <CircularProgress className="progress-circle hidden"/>
        <p>{letter}</p>
      </div>
    </div>
  )
}

export default Message