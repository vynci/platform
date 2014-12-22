var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Device = new Schema({
    name        : { type: String },
    description : { type: String },
    state       : { type: Number },
    owner       : { type: String },
    serial    : { type: String },
    switchNum : { type: Number }
});

module.exports = {
    Device: mongoose.model('Device', Device)
};
