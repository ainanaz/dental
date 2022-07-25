var mongoose = require('mongoose');
var Schema = mongoose.Schema;

receptionistSchema = new Schema( {
	
	unique_id: Number,
	name: String,
    email: String,
    password: String
}),
Receptionist = mongoose.model('Receptionist', receptionistSchema);

module.exports = Receptionist;