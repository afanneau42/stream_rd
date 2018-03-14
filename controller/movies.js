const Movies = require('../models/movies');
var request = require('request');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');


// const Conn = require('../setup/db');

const insertMultiple = (array) => {
    if (array && array.data.movie_count > 0)
    {
        array.data.movies.forEach(e => {
            Movies.create({title: e.title, year: e.year, genre: e.genres, torrents: e.torrents, imdb_id: e.imdb_code, rating: e.rating, cover_image: e.medium_cover_image, background_image: e.background_image, synopsis: e.description_full ? e.description_full : 'No description found', uploaded: 0, runtime: e.runtime, casting:[]}, (err, res) => {
                if (err) throw err;
                
            });
        })
        return 1
    }
    else
        return 0
}

foreach_array = (array) => {
    return new Promise((res) => {
        let array_movies = [];
        array.data.movies.forEach(e => {
            array_movies.push({title: e.title, year: e.year, genre: e.genres, torrents: e.torrents, imdb_id: e.imdb_code, rating: e.rating, cover_image: e.medium_cover_image, background_image: e.background_image, synopsis: e.description_full ? e.description_full : 'No description found', uploaded: 0, runtime: e.runtime, casting:[]})
            
        })
        res(array_movies)
    })
}

const insertMultiple2 = (array) => {
    if (array && array.data.movie_count > 0)
    {
        foreach_array(array)
        .then((array_movies) => {
            Movies.insertMany(array_movies, (err, res) => {
                if (err) throw err;
                return 1
            });
        })
    }
    else
        return 0
}

function requestNewMovies(page) {
    console.log('page:' + page);
    request('https://yifymovie.co/api/v2/list_movies.json?limit=50&page=' + page, function (error, response, body) {
        let parsed_body = JSON.parse(body)    
        if (insertMultiple(parsed_body) !== 0)
            if (parsed_body.data.movies[0])
                requestNewMovies(page + 1)
    })
}

const initMovies = () => {
    requestNewMovies(1);
}

// const updateMovies = () => {
//  
// }

const resetTimer = (id) => {
    Movies.findByIdAndUpdate(id, {last_watched: Date.now()}, (err, doc) => {
        if (err) throw err;
    })
}

const deleteOld = () => {
    // console.log(ISODate(Date.now()))
    let prevMonth = new Date()
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    console.log(prevMonth)
    Movies.find({last_watched: {$lt: prevMonth}, uploaded: 1}, (err, doc) => {
        console.log(doc);
        doc.forEach((e) => {
            console.log(e.file_path)
            if (path.resolve(e.file_path)) {
                console.log('here')
                rimraf(e.file_path, (err) => {
                    if (err) throw err;
                })
                Movies.findByIdAndUpdate(e._id, {uploaded: 0, $unset: {file_path: ''}}, (err, doc) => {
                    if (err) throw err;
                });
            }
        })
    });
}

const isUploaded = (id) => {
    Movies.find({_id: id, uploaded: 1}, (err, doc) => {
        if (doc && doc[0])
            return true;
        else
            return false;
    });
}

module.exports = {
    initMovies,
    resetTimer,
    deleteOld
}

// Fonctions pour les recherches de films, 