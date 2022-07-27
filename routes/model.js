// Requiring module
const mongoose = require('mongoose');
    
// User Modal Schema
const userSchema = new mongoose.Schema({
    unique_id: Number,
	name: String,
	phone: String,
	dob: String,
	city: String,
	email: String,
	password: String,
	passwordConf: String
});
    
// Appointment Modal Schema
const appointmentSchema = new mongoose.Schema({
    user_id: Number,
    bookDate: String,
    bookTime: String,
    services: String
});
     
// Creating model objects
const User = mongoose.model('user', userSchema);
const Appointment = mongoose.model('appointment', appointmentSchema);
    
// Exporting our model objects
module.exports = {
    Appointment, User
}

