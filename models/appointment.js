var mongoose = require('mongoose');
var Schema = mongoose.Schema;

bookSchema = new Schema( {
	
	// unique_id: Number,
	user_id: Number,
    user_name: String,
    bookDate: String,
    bookTime: String,
    services: String,
    doctor: String,
    status: String
    
    

}),
Booking = mongoose.model('Booking', bookSchema);

module.exports = Booking;