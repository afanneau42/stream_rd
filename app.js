const express = require("express")
const path = require("path")
const app = express()
const port = 7777
const torrentStream = require('torrent-stream');

// Set path of html/pug files
const pages = __dirname + '/views/pages'

// Set template engine
app.set('view engine', 'pug')

//Middlewares
app.use('/assets', express.static('public'))

var engine = torrentStream('magnet:?xt=urn:btih:1f11e98ea4736b5bb9a5c643212c10965d25958d&dn=&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Fopentor.org%3A2710&tr=udp%3A%2F%2Ftracker.ccc.de%3A80&tr=udp%3A%2F%2Ftracker.blackunicorn.xyz%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969')

engine.on('ready', function() {
    engine.files.forEach(function(file) {
        console.log('filename:', file.name);
        var stream = file.createReadStream();
        // stream is readable stream to containing the file content 
        console.log("file")
        console.log(file)        
    });
});

app.get('/', (req, res) => {
    res.render(pages + '/index.pug')
})

app.listen(port, (err) => {
    if (err) throw err
})