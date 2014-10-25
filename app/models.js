var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var info = new Schema( {
	serial    : { type: String }, 
	switchNum : { type: Number }
} );

var Device = new Schema({
    name        : { type: String },
    description : { type: String },   
    state       : { type: Number },
    owner       : { type: String },
    info        : [info]
});

module.exports = {
    Device: mongoose.model('Device', Device)
};
