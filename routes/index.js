var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Booking = require('../models/appointment');

router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});


router.get('/signup', function (req, res, next) {
	return res.render('signup.ejs');
});


router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/signup', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;

	if(!personInfo.name || !personInfo.phone || !personInfo.dob|| !personInfo.city|| !personInfo.email || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							name:personInfo.name,
							phone:personInfo.phone,
							dob:personInfo.dob,
							city:personInfo.city,
							email:personInfo.email,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					  res.redirect('/login');
					//res.send({"Success":"You are registered,You can login now."});
					
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

router.get('/adminPage', function (req, res, next) {
	return res.render('admin/adminIndex.ejs');
});

const admin = {
	email:"admin@gmail.com",
	password:"admin123"
}

// ------------------------------------- LOGIN ------------------------------------------

router.post('/login', (req, res)=>{
	
	if(req.body.email == admin.email && req.body.password == admin.password){
		req.session.user = req.body.email;
		res.redirect('/adminPage');
	}else{
	User.findOne({email:req.body.email},function(err,data){
	if(data.email == req.body.email && data.password == req.body.password){
        req.session.userId = data.unique_id;
        res.redirect('/profile');

    }else{
        res.end("Invalid Username")
    }
	})
	};
});

// ------------------------------------- LOGIN ------------------------------------------

router.param('id',function(req,res,next, id){
	User.findById(id, function(err,docs){
		if(err) res.json(err);
		else
		{
			req._id = docs;
			next();
		}
	});
});
// router.get('/profile/:id/', (req, res) => {
// 	const { id } = req.params;
// 	res.send(id)
//   });

router.get('/profile', function (req, res, next) {
	//let id = req.params.unique_id;
	console.log("profile");
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
	 		console.log("found");
			return res.render('profile.ejs' , {
				"id":data.unique_id,
				"name":data.name,
				"phone":data.phone,
				"dob":data.dob,
				"city":data.city,
				"email":data.email
			});
		}
	});
});

// router.get('/profile/:unique_id', function(req, res) {
// 	let id = req.params.unique_id;
// 	User.findById(id, function(err, user) {
// 		if (err)
// 			res.send(err)

// 		 res.render("../views/profile", {user: user});
// 	});
// });

// router.post('/profile/:id', function(req, res) {
// 	// Create Mongose Method to Update a Existing Record Into Collection

// 	let id = req.params.id;
	
// 	var data = {
// 		name : req.body.name,
// 		phone: req.body.phone,
// 		dob: req.body.dob,
// 		city: req.body.city,
// 		email:req.body.email,
// 	}

// 	// Save Admin

// 	User.findByIdAndUpdate(id, data, function(err, user) {
// 	if (err) throw err;

// 	res.redirect("/profile");
// 	});

// });


// router.put('/profile/:id',function(req,res){
// 	User.update({unique_id:req.params.id},
// 				{
// 					name: req.body.name,
// 					phone: req.body.phone,
// 					dob: req.body.dob,
// 					city: req.body.city,
// 					email:req.body.email,
// 				}, function(err){
// 					if(err) res.json(err);
// 					else
// 						res.redirect('/profile/'+req.params.id);
// 				})
// });

router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

//-----------------------------------------------------Appointment---------------------------------------
router.post("/booking",(req,res) => {
    // validate request
	
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
	User.findOne({_id:req.session.userId},function(err,docs){
			req._id = docs;
		});
	

    const appointment = new Booking({
		user_id : req._id,
		bookDate : req.body.date,
		bookTime : req.body.time,
		services: req.body.services   
    })
        

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
});

router.get("/bookingInfo",(req, res,)=>{

	Booking.find((err, docs) => {
        if (!err) {
            res.render("bookingInfo.ejs", {
                data: docs
            });
        } else {
            console.log('Failed to retrieve the Users List: ' + err);
        }
    });

	router.route('/bookingInfo/:id').get((req, res) => {
		Booking.findById(req.params.id, (error, data) => {
		if (error) {
		  return next(error)
		} else {
		  res.json(data)
		}
	  })
	})
    //     Booking.find()
    //         .then(appointment => {
               
	// 			return res.render("bookingInfo.ejs", {appointment: appointment})
    //         })
    //         .catch(err => {
    //             res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
    //         })
    // }

});

router.delete("/delete/:id",(req, res,)=>{
    Booking.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('bookingInfo.ejs');
        } else {
            console.log('Failed to Delete user Details: ' + err);
        }
    });
});

//-----------------------------------------------------Appointment---------------------------------------

router.get('/bookingInfo', function (req, res, next) {
	return res.render('bookingInfo.ejs');
});

router.get('/booking', function (req, res, next) {
	return res.render('booking.ejs');
});

// router.get('/profile', function (req, res, next) {
// 	return res.render('profile.ejs');
// });

router.get('/services', function (req, res, next) {
	return res.render('services.ejs');
});

router.get('/about', function (req, res, next) {
	return res.render('about.ejs');
});

router.get('/contact', function (req, res, next) {
	return res.render('contact.ejs');
});

router.get('/rooms', function (req, res, next) {
	return res.render('rooms.ejs');
});

router.get('/bookingInfo', function (req, res, next) {
	return res.render('bookingInfo.ejs');
});

router.get('/listBooking', function (req, res, next) {
	return res.render('admin/listBooking.ejs');
});

router.get('/patientRecord', function (req, res, next) {
	return res.render('admin/patientRecord.ejs');
});

router.get('/bookingDetail', function (req, res, next) {
	return res.render('admin/bookingDetail.ejs');
});

router.get('/listPatient', function (req, res, next) {
	return res.render('admin/listPatient.ejs');
});

router.get('/listBookingforDr', function (req, res, next) {
	return res.render('admin/listBookingforDr.ejs');
});

module.exports = router;