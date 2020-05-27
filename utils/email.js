const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporterver

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //For Gmail
  // const transporter = nodemailer.createTransport({
  //   service: 'Gmail',
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  //   // Activate in Gmail "less secure app" option
  // });

  // 2) Define the email options
  const mailOptions = {
    from: 'George Kyung <georgekyung@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3) send the email with nodemailer
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
