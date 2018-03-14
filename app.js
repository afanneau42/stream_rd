const express = require("express")
const path = require("path")
const fs = require("fs")
const mime = require("mime-types")
const bodyParser = require("body-parser") 
const imdb = require('imdb-api')
const pirateBay = require('thepiratebay')
const oSub = require('opensubtitles-api');
const openSub = new oSub('TemporaryUserAgent')
const app = express()
const port = 7777
const torrentStream = require('torrent-stream');
const pump = require('pump');
const translate = require('google-translate-api');
var MongoClient = require("mongodb").MongoClient;
const mongoose = require('mongoose');
var request = require('request');
const oId = mongoose.Types.ObjectId;

// Set path of html/pug files
const pages = __dirname + '/views/pages'
const torrent_dir = path.resolve('/goinfre')
// const torrent_dir = path.resolve('/tmp')

// Set template engine
app.set('view engine', 'pug')

//Middlewares
app.use('/assets', express.static('public'))
app.use('/goinfre', express.static('/goinfre'))

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
mime.lookup('.vtt')
// imdb.get('The', {apiKey: '976c2b32', timeout: 30000}).then(console.log).catch(console.log);

app.get('/', (req, res) => {
    res.render(pages + '/index.pug')
})

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }
app.post('/search_movie', (req, res) => {
    console.log(req.body.search)
    imdb.search({title:req.body.search}, {apiKey: '976c2b32'
    }).then(data => {
        console.log(data)

//********** API PIRATE BAY **********//
        // pirateBay.search(data.title, {
        //     category: 'video',
        //     orderBy: 'seeds',
        //     sortBy: 'desc'
        // }).then(results => {
        //     console.log(results)
        // })
//************************************//

//******** API OPEN SUBTITLES ********//
        // openSub.search(
            // {
                // sublanguageid: ['fre', 'eng', ''].join(),
                // imdbid: data.imdbid,
                // extensions: ['srt', 'vtt']
            // }
        // ).then(results => {console.log(results)})
//************************************//
        
        // }).catch(err => {if (err) throw err})
        res.send(['true', data])
    }).catch(
        data => {res.send(['false',data])
    });
})  

app.post('/movie_info', (req, res) => {
    console.log(req.body.imdbid)
    imdb.getById(req.body.imdbid, {apiKey: '976c2b32', timeout: 30000
    }).then(data => {
        res.send(data)
    }).catch((err) => {
        if (err) throw err
    })
})

app.get('/movie_page', (req, res) => {
    console.log('get movie')    
    res.render(pages + '/movie_page.pug', {data: req.query.data})
})

// app.get('/video_dl', (req, res) => {
    // 

app.get('/video', (req, res) => {
    // console.log('estt')
    let file_path = undefined
    // console.log(file)
    engine.on('ready', function() {
        console.log('rdy')
        let file_ext = undefined
        engine.files.forEach(function(file) {
            const ext = path.extname(file.name)
            if (ext === '.mp4' || ext === '.avi' || ext === '.webm' || ext === '.ogv') {
                file_path = path.resolve(torrent_dir + '/torrent-stream/'+req.query.hash+'/' + file.path)
                file_ext = ext
            }
            else {
                console.log(ext + ' N EST PAS PASSE')
                file.deselect()
            }
            console.log('filename:', file.path);
            var stream = file.createReadStream();
            // stream is readable stream to containing the file content 
            console.log("file")
            console.log(file)
        });
        fs.stat(file_path, (err, stats) => {
            console.log(stats)
            var range = req.headers.range;
            if (!range) {
                const head = {
                    'Content-Length': stats.size,
                    'Content-Type': 'video/mp4',
                  }
                res.writeHead(200, head)
                fs.createReadStream(path).pipe(res)
            }
            var positions = range.replace(/bytes=/, "").split("-");
            console.log(positions)
            var start = parseInt(positions[0], 10);
            // var positions = [stats.size / 2, stats.size / 2 + stats.size / 10]
            // var start = positions[0]    
            var total = stats.size;
            var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
            var chunksize = (end - start) + 1;
            const file= fs.createReadStream(file_path, {start, end})
            console.log('\nSIZE FILE')
            console.log(engine.swarm.downloaded / 1000000)
            console.log('/')
            console.log(total / 1000000)
            
            console.log('\nSTART BYTE')
            console.log(start / 1000000)
            console.log('\nEND BYTE')
            console.log(end / 1000000)
    
            // if (engine.swarm.downloaded < start) {
            //     console.log('\nWAITING')
            //     // sleep(1000)
    
            //     var downloaded_start = engine.swarm.downloaded            
            //     var downloaded_end = engine.swarm.downloaded + chunksize          
            //     res.writeHead(206, {
            //         "Content-Range": "bytes " + downloaded_start + "-" + downloaded_end + "/" + total,
            //         "Accept-Ranges": "bytes",
            //         "Content-Length": chunksize,
            //         "Content-Type": "video/webm"
            //       });
            //     var stream = fs.createReadStream(file, { start: downloaded_start, end: downloaded_end })
            //     .on("open", function() {
            //     stream.pipe(res);
            //     }).on("error", function(err) {
            //     res.end(err);
            //     });
            // }
            // else {
                res.writeHead(206, {
                    "Content-Range": "bytes " + start + "-" + end + "/" + total,
                    "Accept-Ranges": "bytes",
                    "Content-Length": chunksize,
                    "Content-Type": "video/"+ file_ext.replace('.', '')
                });
                
                file.pipe(res)

                // var stream = fs.createReadStream(file_path, { start: start, end: end })
                // .on("open", function() {
                // stream.pipe(res);
                // }).on("error", function(err) {
                // res.end(err);
                // });
            // }
        })
    });
})

function stream (res, file, start, end) {
    console.log('in stream')
    let stream = file.createReadStream({
        start: start,
        end: end
    });
    pump(stream, res);
}

app.get('/torrent', (req, res) => {
    console.log('IN TORRENT')
    console.log('header range ')
    if (req.headers.range)
        console.log(req.headers.range)
    else
        console.log('no req range')
        const engine = torrentStream('magnet:?xt=urn:btih:' + req.query.hash, {
        connections: 100,
        uploads: 10,
        path: torrent_dir + '/torrent-stream',
        verify: true,
        trackers: [
            'udp://tracker.leechers-paradise.org:6969/announce',
            'udp://tracker.pirateparty.gr:6969/announce',
            'udp://tracker.coppersurfer.tk:6969/announce',
            'http://asnet.pw:2710/announce',
            'http://tracker.opentrackr.org:1337/announce',
            'udp://tracker.opentrackr.org:1337/announce',
            'udp://tracker1.xku.tv:6969/announce',
            'udp://tracker1.wasabii.com.tw:6969/announce',
            'udp://tracker.zer0day.to:1337/announce',
            'udp://p4p.arenabg.com:1337/announce',
            'http://tracker.internetwarriors.net:1337/announce',
            'udp://tracker.internetwarriors.net:1337/announce',
            'udp://allesanddro.de:1337/announce',
            'udp://9.rarbg.com:2710/announce',
            'udp://tracker.dler.org:6969/announce',
            'http://mgtracker.org:6969/announce',
            'http://tracker.mg64.net:6881/announce',
            'http://tracker.devil-torrents.pl:80/announce',
            'http://ipv4.tracker.harry.lu:80/announce',
            'http://tracker.electro-torrent.pl:80/announce'
        ]
    });

    engine.on('ready', () => {
        engine.files.forEach(function(file) {
            console.log('filename:', file.name);
            const ext = path.extname(file.name)
            if (ext === '.mp4' || ext === '.ogg' || ext === '.mkv') {
                file.select();
                // engine.on('torrent', () => {
                    // console.log('FETCHED')
                    console.log('file : '  )
                    // let stats = fs.statSync(torrent_dir + '/torrent-stream/' + file.path)
                    console.log(file.length)
                    let total = file.length;
                    let start = 0;
                    let end = total - 1;

                    if (req.headers.range) {
                        let range = req.headers.range;
                        console.log('req.headers.range :' + req.headers.range)
                        let parts = range.replace(/bytes=/, '').split('-');
                        let newStart = parts[0];
                        let newEnd = parts[1];
                        console.log('newEnd : ' + newEnd)
                        console.log('total : ' + total)

                        start = parseInt(newStart, 10);
                        end = newEnd ? parseint(newEnd, 10) : total - 1;
                        let chunksize = end - start + 1;
                        // let movie_path = path.resolve(torrent_dir + '/torrent-stream/' + req.query.hash + '/' + file.path);
                        let movie_path = path.resolve(torrent_dir + '/torrent-stream/' + file.path);
                        console.log(start + '   ' + end)
                        console.log(chunksize)
                        res.writeHead(206, {
                        'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
                        'Accept-Ranges': 'bytes',
                        'Content-Length': chunksize,
                        'Content-Type': 'video/'+ ext.replace('.', ''),
                        Connection: 'keep-alive'
                        });
                        console.log('video/'+ ext.replace('.', ''))
                        
                        console.log(movie_path)
                        // file.pipe(res)
                        let stream = fs.createReadStream(movie_path, {
                            start: start,
                            end: end
                        }).pipe(res);
                        // pump(stream, res);
                    }
                    else {
                        res.writeHead(200, {
                            'Content-Length': total,
                            'Content-Type': 'video/'+ ext.replace('.', '')
                        });

                        let stream = fs.createReadStream(movie_path, {
                            start: start,
                            end: end
                        });
                        pump(stream, res);
                    }
                // })                
            }
            else {
                console.log('ext \''+ext+'\' not recognized')
                file.deselect()                
                return;
            }
        });
    })
})

app.get('/subtitles', (req, res) => {
    if (req.query.imdbid) {
        openSub.search({
            // sublanguageid: 'fre',
            imdbid: req.query.imdbid
        }).then((results) => {
            console.log(results)
        })
    }
})

app.listen(port, (err) => {
    if (err) throw err
})

// MongoClient.connect("mongodb://localhost:27017", (err, client) => {
//     if (err) throw err;

//     console.log('Connected to DB tutoriel');
//     let db = client.db('tutoriel')
//     db.createCollection('personnages2', (err, results) => {
//         if (err) throw err;

//         console.log('here')
//     })
//     db.collection('personnages2').insertOne({name: 'Louis Choulage', age: 42, Location: 'Paris'}, (err, res) => {
//         if (err) throw err;
        
//         console.log('document insert')
//     })
//     db.collection('personnages2').find({}).sort({age: -1}).toArray((err, results) => {
//         if (err) throw err;

//         console.log(results)
//     })
// })

mongoose.connect('mongodb://localhost:27017/hypertube');

// const Schema = mongoose.Schema,
//     ObjectId = Schema.ObjectId;

// const BlogPost = new Schema({
//     author: ObjectId,
//     title: String,
//     body: String,
//     date: Date
// });

const moviesCtrl = require('./controller/movies')

// request('https://yifymovie.co/api/v2/list_movies.json?limit=50&page=' + 1, function (error, response, body) {
//     console.log('error:', error); // Print the error if one occurred and handle it
//     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//     // console.log(body)
//     let ret = moviesCtrl.insertMultiple(JSON.parse(body))
//     console.log(ret)
//     let page = 1
//     while (ret !== 0) {
//         console.log('testtestst')
//         page++;
//         request('https://yifymovie.co/api/v2/list_movies.json?limit=50&page=' + page, function (error, response, body) {
//             ret = moviesCtrl.insertMultiple(JSON.parse(body))
//         })
//     }
// });

// moviesCtrl.initMovies()

moviesCtrl.deleteOld();
