const mongoose = require('mongoose');

mongoose.connect('mongo://localhost:27017/hypertube');

var conn = mongoose.connection;

module.exports = conn;