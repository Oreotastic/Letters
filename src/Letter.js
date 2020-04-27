import React from 'react'

const Letter = ({myLetter, setMyLetter}) => {

  return (
    <div id="letterbox">
      <textarea id="letter" type="text" value={myLetter} onChange={(el) => setMyLetter(el.target.value)}/>
    </div>
  )
}

export default Letter