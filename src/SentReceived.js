import React, {useState} from 'react'
import {Tabs, Tab} from '@material-ui/core'
import Received from './Received'
import Sent from './Sent'

const SentReceived = ({received, sent}) => {
  const [tabIndex, setTabIndex] = useState(0)

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  }

  return (
    <>
      <Tabs value={tabIndex} onChange={handleChange}>
        <Tab label="Received">
        </Tab>
        <Tab label="Sent">
        </Tab>
      </Tabs>
      {tabIndex === 0 && <Received received={received} />}
      {tabIndex === 1 && <Sent sent={sent} />}
    </>
  )
}

export default SentReceived