const sendEmail = require("./sendEmail");

const sendOTPEmail = async (email, otp) => {

    const subject = "HeritageSphere Email Verification OTP";

    const html = `
        <div style="font-family:Arial,sans-serif;padding:20px">

            <h2>Welcome to HeritageSphere</h2>

            <p>Your verification code is:</p>

            <h1 style="
                letter-spacing:6px;
                color:#d4af37;
            ">
                ${otp}
            </h1>

            <p>
                This OTP is valid for
                <strong>1 minute</strong>.
            </p>

            <p>
                If you didn't request this,
                please ignore this email.
            </p>

        </div>
    `;

    await sendEmail(email, subject, html);

};

module.exports = sendOTPEmail;