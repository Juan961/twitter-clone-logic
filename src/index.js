const express = require('express')
const app = express()
const cors = require('cors')
const routerApi = require('./routes')
const path = require('path')

app.use(cors())
app.use(express.json())
app.use('/static', express.static(path.join(__dirname, '/public')))

routerApi(app)

module.exports = app
