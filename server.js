const express = require('express')
const app = express()
const db = require('./db')
const path = require('path')


app.use(express.json())

app.use('/dist', express.static(path.join(__dirname, 'dist')))
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/src/assets', express.static(path.join(__dirname, 'assets')))



app.get('/', (req, res, next) => {
  console.log(req.body)
  res.sendFile(path.join(__dirname, 'index.html'))
})


app.get('/api/letters', (req, res, next) => {
  
  db.getMessages()
    .then(response => res.send(response))
    .catch(next)
})

app.get('/api/letters/:id', (req, res, next) => {

  // db.getMessage(id)
  //   .then(response => res.send(response))
  //   .catch(next)
})

app.post('/api/letters', (req, res, next) => {
  db.createMessage(req.body.msg)
    .then(response => res.send(response))
    .catch(next)
})

const port = process.env.PORT || 3000;

db.sync().then(() => {
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
});
