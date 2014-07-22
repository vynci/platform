var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Device = new Schema({
    name:      { type: String },
    description:      { type: String },
    state: {type: String}
});

module.exports = {
    Device: mongoose.model('Device', Device)
};
