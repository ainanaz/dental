var mongoose = require('mongoose');
var Schema = mongoose.Schema;

bookSchema = new Schema( {
	
	unique_id: Number,
	user_id: Number,
    bookDate: String,
    bookTime: String,
    services: String

}),
Booking = mongoose.model('Booking', bookSchema);

module.exports = Booking;