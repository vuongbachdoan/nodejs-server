const mongoose = require('mongoose')
mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
})

module.exports = mongoose.model('users', userSchema)