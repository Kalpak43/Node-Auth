const nodemailer = require("nodemailer");
const bcryptjs = require("bcryptjs");
const { User } = require("../models/userModel");

async function sendMail({ email, emailType, userId }) {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    if (emailType === "VERIFY") {
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            verifyToken: hashedToken,
            verifyTokenExpiry: Date.now() + 3600000,
          },
        }
      );
    } else if (emailType === "RESET") {
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: Date.now() + 3600000,
          },
        }
      );
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
    });

    const mailOptions = {
      from: "kalpakgoshikwar123@gmail.com",
      to: email,
      subject: `${emailType} Email`,
      html: `
          <h1>${emailType} Email</h1>
          <p>Click on the link below to ${emailType.toLowerCase()} your email</p>
          <a href="${
            process.env.DOMAIN
          }/verifyemail?token=${hashedToken}">Click here</a>
          <p> or copy and paste the link below in your browser</p>
          <br/>
          <p>${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>
          `,
    };

    const mailResponse = await transport.sendMail(mailOptions);

    return mailResponse;
  } catch (error) {
    console.log("Error in sendMail", error);
    throw error;
  }
}

module.exports = { sendMail };
