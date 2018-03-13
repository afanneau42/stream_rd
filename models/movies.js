const mongoose = require('mongoose');

const moviesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    genre: {
        type: Array,
        required: true
    },
    torrents: {
        type: Array,
        required: true
    },
    imdb_id: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true        
    },
    cover_image: {
        type: String,
        required: true        
    },
    background_image: {
        type: String,
        required: true        
    },
    synopsis: {
        type: String,
        required: true
    },
    uploaded: {
        type: Number
    },
    runtime: {
        type: Number,
        required: true
    },
    casting: {
        type: Array,
        required: true
    }
})

moviesSchema.pre('save', function(next) {
    next();
});

const Movies = mongoose.model('User', userSchema);

module.exports = Movies;