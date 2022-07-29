var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Booking = require('../models/appointment');
var nodemailer = require('nodemailer');

 

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
	console.log(req.session.user);
	return res.render('admin/adminIndex.ejs');
});



const admin = {
	email:"admin@gmail.com",
	password:"admin123",	
}

router.get('/adminPage', function (req, res, next){
	return res.render('admin/doctorIndex.ejs');
} );

const doctor = {
	email:"doctor@gmail.com",
	password:"doctor123",	
}

// ------------------------------------- LOGIN ------------------------------------------

router.post('/login', (req, res)=>{
	
	if(req.body.email == admin.email && req.body.password == admin.password){
		req.session.user = req.body.email;
		res.redirect('/adminPage');
	}else if(req.body.email == doctor.email && req.body.password == doctor.password){
		req.session.user = req.body.email;
		res.redirect('/adminPage');
	}else
	{
		User.findOne({email:req.body.email},function(err,data){
		if(data){
		if(data.email == req.body.email && data.password == req.body.password){
			req.session.userId = data._id;
			res.redirect('/profile');

    	}else{
        res.end("Invalid Password")
    	}
		}else{
			res.end("This email is not registered")
		}
		})
	};
});



// ------------------------------------- LOGIN ------------------------------------------
router.get('/profile', function (req, res, next) {
	//let id = req.params.unique_id;
	console.log("profile");
	User.findOne({_id:req.session.userId},function(err,data){
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

router.post('/update', function(req, res, next) {
	// Create Mongose Method to Update a Existing Record Into Collection
	
	var data = {
		name : req.body.name,
		phone: req.body.phone,
		dob: req.body.dob,
		city: req.body.city,
		email:req.body.email
	}
		// Save User
		User.findByIdAndUpdate({_id:req.session.userId}, data, function(err, docs) {
			if (err) throw err
			else{
				console.log(docs);
				res.redirect('/profile');
			}
	
	});
	});
	//let id = req.params.unique_id;
	
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
        res.status(400).send({ message : "Content cannot be empty!"});
        return;
    }

	User.findOne({_id:req.session.userId},function(err,data){
		let id = data.unique_id;
		const appointment = new Booking({
		user_id : id,
		user_name: data.name,
		bookDate : req.body.date,
		bookTime : req.body.time,
		services: req.body.services,
		status:"Approved"   
    })
        
    // new booking
    // save user in the database
    appointment
        .save(appointment)
        .then(data => {
            //res.send(data)
            res.redirect('bookingInfo');
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });
	});
	
});

router.get("/bookingInfo",(req, res,)=>{
	
	User.findOne({_id:req.session.userId},function(err,data){
	Booking.find({user_id:data.unique_id},(err, docs) => {
        if (!err) {	
            res.render("bookingInfo.ejs", {
                data: docs
            });	
        } else {
            console.log('Failed to retrieve the Users List: ' + err);
        }
	});

});
});


router.get("/delete/:_id",(req, res,)=>{	
    Booking.findByIdAndRemove(req.params._id, (err, doc) => {
        if (!err) {
            res.redirect('/bookingInfo');
        } else {
            console.log('Failed to Delete user Details: ' + err);
        }
    });
});
// 


//-------------------------------------------------------APPOINTMENT-------------------------------------------------------------------
 
//LIST BOOKING
//------------------------------------------------ADMIN------------------------------------------------------------------------------



router.get("/listBooking",(req, res,)=>{

	Booking.find((err, docs) => {
        if (!err) {
			if((req.session.user == admin.email)){
				
				return res.render('admin/listBooking.ejs', {
					data:docs,
				});	
				}
			 else if ((req.session.user == doctor.email)){
					return res.render('admin/listBookingforDr.ejs', {
						data:docs,
					});	
				}
					
            
				
                
            //});
        } else {
            console.log('Failed to retrieve the Booking List: ' + err);
        }
    });

	
}); 



//updateListBooking Admin ----------------

router.post('/updateAdmin/:_id', function(req, res, next) {
	// Create Mongose Method to Update a Existing Record Into Collection

		// Save User
		Booking.findByIdAndUpdate({_id:req.params._id}, {doctor: req.body.doctor}, function(err, docs) {
			if (err) throw err
			else{
				console.log(docs);
				res.redirect('/listBooking');
			}
	
	});
	}); 


router.get("/deleteAdmin/:_id",(req, res,)=>{
    Booking.findByIdAndRemove(req.params._id, (err, doc) => {
		let id = doc.user_id;
        if (!err) {
            res.redirect('/listBooking');
        } else {
            console.log('Failed to Delete user Details: ' + err);
        }
 });
});

//Patient Record-----------------

router.get('/mainpage', function (req, res, next) {
	return res.render('mainpage.ejs');
});

router.get('/services2', function (req, res, next) {
	return res.render('services2.ejs');
});



//LIST OF PATIENT ---------------------------
router.get("/listPatient",(req, res,)=>{

	User.find((err, docs) => {
        if (!err) {
            res.render("admin/listPatient.ejs", {
				data: docs,
            });
        } else {
            console.log('Failed to retrieve the Patient List: ' + err);
        }
    });

	
}); 

router.get("/patientRecord/:unique_id",(req, res,)=>{
		Booking.find({user_id:req.params.unique_id},(err, document) => {
			if (!err) {
				res.render('admin/patientRecord.ejs', {
					data: document
					
				});
			} else {
				console.log('Failed to retrieve the Booking List: ' + err);
			}
		});
});

//-----------------------------------------------------ADMIN---------------------------------------


router.get('/booking', function (req, res, next) {
	if(req.session.userId){
	return res.render('booking.ejs');
}
else{
	res.send("Please Login First For Booking ");
}
});

router.get('/editprofile', function (req, res, next) {
	return res.render('editProfile.ejs');
});

router.get('/services', function (req, res, next) {
	return res.render('services.ejs');
});

router.get('/contact', function (req, res, next) {
	return res.render('contact.ejs');
});

router.get('/bookingInfo', function (req, res, next) {
	return res.render('bookingInfo.ejs');
});

router.get('/listBooking', function (req, res, next) {
	if((req.session.user = "admin@gmail.com")){
	return res.render('admin/listBooking.ejs');
	}
	else{
		return res.render('admin/listBookingforDr.ejs');
	}
	
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



module.exports = router;

