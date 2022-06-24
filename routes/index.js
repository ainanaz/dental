var express = require('express');
var router = express.Router();
var User = require('../models/user');

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
router.post('/login', (req, res)=>{
	
	if(req.body.email == admin.email && req.body.password == admin.password){
		req.session.user = req.body.email;
		res.redirect('/adminPage');
	}else{
	User.findOne({email:req.body.email},function(err,data){
	if(data.email == req.body.email && data.password == req.body.password){
        req.session.userId = data.unique_id;
        res.redirect('/profile');
        //res.end("Login Successful...!");
    }else{
        res.end("Invalid Username")
    }
	})
	};
});


router.get('/profile', function (req, res, next) {
	console.log("profile");
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('data.ejs', {
				"name":data.name,
				"phone":data.phone,
				"dob":data.dob,
				"city":data.city,
				"email":data.email
			});
		}
	});
});



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

// router.get('/forgetpass', function (req, res, next) {
// 	res.render("forget.ejs");
// });

// router.post('/forgetpass', function (req, res, next) {
// 	//console.log('req.body');
// 	//console.log(req.body);
// 	User.findOne({email:req.body.email},function(err,data){
// 		console.log(data);
// 		if(!data){
// 			res.send({"Success":"This Email Is not regestered!"});
// 		}else{
// 			// res.send({"Success":"Success!"});
// 			if (req.body.password==req.body.passwordConf) {
// 			data.password=req.body.password;
// 			data.passwordConf=req.body.passwordConf;

// 			data.save(function(err, Person){
// 				if(err)
// 					console.log(err);
// 				else
// 					console.log('Success');
// 					res.send({"Success":"Password changed!"});
// 			});
// 		}else{
// 			res.send({"Success":"Password does not matched! Both Password should be same."});
// 		}
// 		}
// 	});
	
// });

router.get('/booking', function (req, res, next) {
	return res.render('booking.ejs');
});


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


module.exports = router;