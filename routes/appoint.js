var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Booking = require('../models/appointment');

router.create =(req,res) => {
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    
    User.findOne({unique_id:_id},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
	 		console.log(_id);
             const appointment = new Booking({
                user_id : unique_id,
                bookDate : req.body.date,
                bookTime : req.body.time,
                services: req.body.services   
            })
        }
    });

    // new booking
    // save user in the database
    appointment
        .save(appointment)
        .then(data => {
            //res.send(data)
            res.redirect('/bookingInfo');
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });

        // LIST BOOKING
    appointment
        .save(appointment)
        .then(data => {
            //res.send(data)
            res.redirect('/listBooking');
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });  
}

router.get('/bookingInfo', function (req, res, next) {
	return res.render('bookingInfo.ejs');
});

router.get('/listBooking', function (req, res, next) {
	return res.render('/admin/listBooking.ejs');
});