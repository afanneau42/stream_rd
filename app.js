const express = require("express")
const path = require("path")
const fs = require("fs")

const app = express()
const port = 7777
const torrentStream = require('torrent-stream');

// Set path of html/pug files
const pages = __dirname + '/views/pages'

// Set template engine
app.set('view engine', 'pug')

//Middlewares
app.use('/assets', express.static('public'))

var engine = torrentStream('magnet:?xt=urn:btih:5aa6a160a7470b00e4b3d0ee824333fb7c934ca7&dn=Zenith%20(2011)%20(theora)&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Fopentor.org%3A2710&tr=udp%3A%2F%2Ftracker.ccc.de%3A80&tr=udp%3A%2F%2Ftracker.blackunicorn.xyz%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969', {
    connections: 100,
    uploads: 10,
    tmp: '/goinfre',
    verify: true,
    dht: true,
    tracker: true,
    trackers: [
        'udp://tracker.openbittorrent.com:80',
        'udp://tracker.ccc.de:80'
    ]
})

engine.on('ready', function() {
    console.log('rdy')
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

app.get('/video', (req, res) => {
    console.log('estt')
    const file = path.resolve('/goinfre/torrent-stream/5aa6a160a7470b00e4b3d0ee824333fb7c934ca7/Zenith.Part.1.2011.Theora-VODO/Zenith.Part.1.2011.Theora-VODO.ogv')
    console.log(file)
    fs.stat(file, (err, stats) => {
        console.log(stats)
        var range = req.headers.range;
        if (!range) {
        //  416 Wrong range
         return res.sendStatus(416);
        }
        var positions = range.replace(/bytes=/, "").split("-");
        console.log(positions)
        var start = parseInt(positions[0], 10);
        // var positions = [stats.size / 2, stats.size / 2 + stats.size / 10]
        // var start = positions[0]    
        var total = stats.size;
        var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        var chunksize = (end - start) + 1;

        res.writeHead(206, {
            "Content-Range": "bytes " + start + "-" + end + "/" + total,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/webm"
          });
        
        var stream = fs.createReadStream(file, { start: start, end: end })
        .on("open", function() {
        stream.pipe(res);
        }).on("error", function(err) {
        res.end(err);
        });
    })
})

app.listen(port, (err) => {
    if (err) throw err
})