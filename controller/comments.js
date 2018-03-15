const Comments = require('../models/comments');

const addComment = (comment, author_id, movie_id) => {
    Comments
        .create({
            movie_id: movie_id,
            author_id: author_id,
            content: comment,
            date: Date.now()
        }, (err, res) => {
        });
}

const getComments = (movie_id) => {
    Comments
        .find({movie_id: movie_id})
        .sort({date: -1})
        .exec((err, doc) => {
            return doc;
        })
}

module.exports = {

}