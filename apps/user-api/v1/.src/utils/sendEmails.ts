import nodeMailer from 'nodemailer';
import {config} from '../config/config'


const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    service: config.smtpService,
    auth: {
      user: config.smtpMail,
      pass: config.smtpPassword,
    },
  });

  const mailOptions = {
    from: config.smtpMail,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
