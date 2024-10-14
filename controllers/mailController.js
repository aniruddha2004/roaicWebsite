const nodemailer = require('nodemailer');
require('dotenv').config();

// Contact POST route
const mailSender = async (req, res) => {
    const { name, email, message } = req.body;
  
    // Set up Gmail SMTP transporter
    let transporter = nodemailer.createTransport({
      service: 'gmail', // Use Gmail service
      auth: {
        user: process.env.EMAIL_ID, // Your Gmail account
        pass: process.env.EMAIL_PASSWORD // Your Gmail App Password if 2FA is enabled or your regular password
      },
      secure: false, // Use TLS
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates
      }
    });
  
    // Define the email options
    let mailOptions = {
      from: `"Robotics Club Contact Form" <${email}>`, // Sender address
      to: process.env.EMAIL_ID, // Email address to receive form submissions
      subject: 'New Contact Form Submission', // Subject line
      text: `You have a new message from ${name} (${email}):\n\n${message}`, // Plain text body
      html: `<p>You have a new message from <strong>${name}</strong> (<a href="mailto:${email}">${email}</a>):</p><p>${message}</p>` // HTML body
    };
  
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email: ', error);
        res.render('contact', { currentPage: 'contact', user: req.session.user, message: 'Something went wrong. Please try again later.' });
      } else {
        console.log('Email sent: ' + info.response);
        res.render('contact', { currentPage: 'contact', user: req.session.user, message: 'Thank you for your message! We will get back to you soon.' });
      }
    });
  };

  module.exports = {mailSender}