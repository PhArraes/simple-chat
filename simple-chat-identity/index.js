
const express = require('express')
const app = express()
const port = 3002

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/identity', (req, res) => {
    res.send('identity')
  })
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
