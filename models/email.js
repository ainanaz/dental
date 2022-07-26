function sendMail() 
{
  var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dentalaimu@gmail.com',
    pass: 'aimu1234'
  }
});

var mailOptions = {
  from: 'dentalaimu@gmail.com',
  to: 'ummuaiman3019@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});  
}

