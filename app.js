const express = require("express")
const path = require("path")
const app = express()
const port = 7777

// Set path of html/pug files
const pages = __dirname + '/views/pages'

// Set template engine
app.set('view engine', 'pug')

//Middlewares
app.use('/assets', express.static('public'))

app.get('/', (req, res) => {
    res.render(pages + '/index.pug')
})

app.listen(port, (err) => {
    if (err) throw err
})