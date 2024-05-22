const nodemailer = require("nodemailer");
require('dotenv').config(); // Ensure this line is at the top to load environment variables

// Function to send an email
const sendEmail = (mailOptions) => {
  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: "hotmail",

    auth: {
      user: process.env.EMAIL_USER, // Your Gmail account
      pass: process.env.EMAIL_PASS, // Your Gmail app password
    },
  });

  // // Set up email data with unicode symbols
  // const mailOptions = {
  //   from: process.env.EMAIL_USER, // Sender address
  //   to, // List of receivers
  //   subject, // Subject line
  //   text, // Plain text body
  // };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.error("Error sending email: ", error);
    }
    console.log("Email sent: ", info.response);
  });
};


 module.exports = {sendEmail}
// Usage example:
// sendEmail("recipient@example.com", "Hello from Nodemailer", "This is a test email sent using Nodemailer.");