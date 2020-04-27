import React from 'react'

const Message = ({letter}) => {
  return(
    <div id="message">
      <div className="messagebox">
        <p>{letter}</p>
      </div>
    </div>
  )
}

export default Message