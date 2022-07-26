// Requiring mongoose module
const mongoose = require('mongoose');
  
// Importing Models Student and Course from model.js
const { Appointment, User } = require('./model');
  
// Connecting to database
mongoose.connect('mongodb://localhost:27017/dentalProject',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });
  
var dbUser = [];
  
// Finding courses of category Database
User.find({ category: "dentalProject" })
    .then(data => {
        console.log("dentalProject User:")
        console.log(data);
  
        // Putting all course id's in dbcourse arrray
        data.map((d, k) => {
            dbUser.push(d._id);
        })
  
        // Getting students who are enrolled in any
        // database course by filtering students
        // whose courseId matches with any id in
        // dbcourse array
        Appointment.find({ userId: { $in: dbUser } })
            .then(data => {
                console.log("Appointment  in Database Courses:")
                console.log(data);
            })
            .catch(error => {
                console.log(error);
            })
    })
    .catch(error => {
        console.log(error);
    })