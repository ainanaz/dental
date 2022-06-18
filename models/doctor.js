var mongoose = require('mongoose');
var Schema = mongoose.Schema;

doctorSchema = new Schema( {
	
	unique_id: Number,
	name: String,
    email: String,
    password: String
}),
Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;