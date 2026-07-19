const transporter = require("../config/mail");

const sendEmail = async (to, subject, html) => {

    try {

        await transporter.sendMail({

            from: `"HeritageSphere" <${process.env.EMAIL_USER}>`,

            to,

            subject,

            html

        });

        console.log("Email Sent Successfully");

    } catch (error) {

        console.log(error);

        throw new Error("Failed to send email");

    }

};

module.exports = sendEmail;