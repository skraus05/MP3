const express = require('express')
const morgan = require('morgan')
const path = require('path');
const { sequelize : db } = require('./models')
const PORT = process.env.PORT || 8080
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config();

// logging middleware
app.use(morgan('dev'))
app.use(cors())
// body parsing middleware
app.use(express.json())

// auth and api routes
app.use('/auth', require('./auth'))
app.use('/api', require('./api'))

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '..', 'public/index.html')));

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')))

// any remaining requests with an extension (.js, .css, etc.) send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found')
    err.status = 404
    next(err)
  } else {
    next()
  }
})

// sends index.html
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
})


app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})

app.listen(process.env.PORT, ()=> {
  console.log(`Server is running on port ${process.env.PORT}`)
})

module.exports = app