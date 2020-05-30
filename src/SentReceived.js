import React, {useState} from 'react'
import {Tabs, Tab, ThemeProvider, createMuiTheme} from '@material-ui/core'
import Received from './Received'
import Sent from './Sent'

const SentReceived = ({received, sent}) => {

  const [tabIndex, setTabIndex] = useState(0)

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  }

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#89DAFF'
      },
      secondary: {
        main: '#D65CB1'
      }
    }
  })
  return (
    <>
      <Tabs value={tabIndex} onChange={handleChange}>
        <Tab label="Received">
        </Tab>
        <Tab label="Sent">
        </Tab>
      </Tabs>
      <ThemeProvider theme={theme}>
        {tabIndex === 0 && <Received received={received} />}
        {tabIndex === 1 && <Sent sent={sent} />}
      </ThemeProvider>
    </>
  )
}

export default SentReceived