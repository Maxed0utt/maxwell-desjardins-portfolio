const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(express.json())
app.use(cors({
  origin: `${process.env.BASEURL}:${process.env.PORT}`,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}))

// Set EJS as the templating engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views/pages'))

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')))

// Bring in express routes
require('./routes/index')(app)

// Start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on ${process.env.BASEURL}:${PORT}`)
})
