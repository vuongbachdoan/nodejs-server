const mongoose = require('mongoose')
mongoose.Promise = global.Promise;

const courseSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('course', courseSchema)