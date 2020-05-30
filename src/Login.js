import React from 'react'
import Button from '@material-ui/core/Button'

const Login = ({theme, ThemeProvider}) => {

  return (
    <div>
      <a href="/auth/google">
        <ThemeProvider theme={theme}>
          <Button variant="outlined" color="primary">Login With Google</Button>
        </ThemeProvider>
      </a>
    </div>
  )
}

export default Login