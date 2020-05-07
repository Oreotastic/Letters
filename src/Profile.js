import React, {useState} from 'react'

const Profile = ({letter, user, replies, createReply, myLetter, setMyLetter}) => {

  const showTextBox = () => {
    const letterBox = document.getElementById("hiding-letter")
    letterBox.style.display = "block"
  }

  const hideTextBox = () => {
    const letterBox = document.getElementById("hiding-letter")
    letterBox.style.display = "none"
  }

  const [selectedReply, setSelectedReply] = useState()

  return (
    <div>
      <h2>Welcome {user.name}</h2>
      <ul>
        {
          replies.map(reply => {
            return (
              <li key={reply.id}>
                <p>
                  {reply.replymsg}
                </p>
                <img className="icon paper profile-icon" src="https://i.imgur.com/2MT34wZ.png" alt="paper" onClick={() => {
                  showTextBox()
                  setSelectedReply(reply)
              }}/> 
              <div id="hiding-letter">
                <textarea id="letter" value={myLetter} onChange={(el) => setMyLetter(el.target.value)}/>
                <button onClick={() => {
                    createReply(reply.oguserid, reply.id, myLetter)
                    hideTextBox()
                  }}>
                  Send
                </button>
              </div>
              </li>
            )
          })
        }
      </ul>
     
    </div>
  )
  
}

export default Profile