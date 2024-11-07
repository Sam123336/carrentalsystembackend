// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(bodyParser.json());


const port = process.env.PORT || 5000;
// Set up Ethereal transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'cornelius.keeling21@ethereal.email',
    pass: 'hegFy6yJpeDbcSKjgF'
  }
});

// Email sending route
app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to) {
    console.log("No recipient specified");
    return res.status(400).json({ message: "Recipient email ('to') is required" });
  }

  try {
    const info = await transporter.sendMail({
      from: '"Car Rental Service" <no-reply@carrental.com>',
      to, // recipient email
      subject: subject || 'Your Car Reservation', // default subject if not provided
      text: text || 'This is your reservation confirmation.', // default text if not provided
      html: `<b>${text || 'This is your reservation confirmation.'}</b>` // basic HTML content
    });

    console.log('Message sent:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));

    res.status(200).json({
      message: 'Email sent successfully!',
      previewUrl: nodemailer.getTestMessageUrl(info) // link to view email
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email', error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
