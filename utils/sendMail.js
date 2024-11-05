import nodeMailer from 'nodemailer';

export const sendEmail = async (receiver, subject, message) => {
    console.log(process.env.MAIL_HOST);
    try {
        const transporter = nodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            service: process.env.MAIL_SERVICE,
            secure: false,
            auth: {
                user: process.env.MAIL_NAME,
                pass: process.env.MAIL_PASS,
            },
        });

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: Arial, sans-serif; color: #333333; margin: 0; padding: 0; background-color: #f4f4f4; }
                    .container { width: 100%; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
                    .header { text-align: center; padding: 20px; background-color: #4CAF50; color: white; border-radius: 8px 8px 0 0; }
                    .header h1 { margin: 0; font-size: 24px; }
                    .content { padding: 20px; text-align: left; color: #555555; }
                    .content p { font-size: 16px; line-height: 1.5; }
                    .button-container { text-align: center; margin: 20px 0; }
                    .button { background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; }
                    .footer { text-align: center; font-size: 14px; color: #888888; padding: 20px; border-top: 1px solid #dddddd; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Vraman Sathi Pvt. Ltd!</h1>
                    </div>
                    <div class="content">
                        <p>Dear Valued User,</p>
                       
                        <p>${message}</p>
                        <div class="button-container">
                            <a href="https://www.yourwebsite.com" class="button">Visit Our Website</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>Follow us on <a href="https://www.facebook.com">Facebook</a> | <a href="https://www.twitter.com">Twitter</a></p>
                        <p>&copy; ${new Date().getFullYear()} Vraman Sathi Pvt. Ltd. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: `Vraman Sathi Pvt. Ltd. <${process.env.MAIL_NAME}>`,
            to: receiver,
            subject: subject,
            html: htmlContent, // Use HTML content
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.log("Email not sent", error);
    }
};






export const sendOTP = async (receiver, subject, otp) => {
  console.log('Mail Host:', process.env.MAIL_HOST);
  try {
      const transporter = nodeMailer.createTransport({
          host: process.env.MAIL_HOST,
          port: process.env.MAIL_PORT,
          service: process.env.MAIL_SERVICE,
          secure: false, // Set to true if you're using a secure connection
          auth: {
              user: process.env.MAIL_NAME,
              pass: process.env.MAIL_PASS,
          },
      });

      const mailOptions = {
          from: `"Vraman Sathi Pvt. Ltd." <${process.env.MAIL_NAME}>`,
          to: receiver,
          subject: subject,
          html: generateOTPHTML(otp), // Use the HTML generator function
      };

      await transporter.sendMail(mailOptions);
      console.log('OTP email sent successfully to', receiver);
  } catch (error) {
      console.error('Email not sent:', error);
  }
};

/**
* Generates an HTML template for the OTP email.
*
* @param {string} otp - The OTP code to include in the email.
* @returns {string} - The complete HTML content for the email.
*/
const generateOTPHTML = (otp) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Account Verification - Vraman Sathi Pvt. Ltd.</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
          .container {
              width: 100%;
              max-width: 600px;
              margin: auto;
              background-color: #ffffff;
              padding: 20px;
              border: 1px solid #dddddd;
              border-radius: 8px;
              text-align: center;
          }
          .header {
              background-color: #004080;
              color: #ffffff;
              padding: 10px 0;
              font-size: 24px;
              font-weight: bold;
          }
          .content {
              padding: 20px;
              font-size: 16px;
              color: #333333;
          }
          .otp {
              font-size: 28px;
              font-weight: bold;
              color: #004080;
              margin: 20px 0;
          }
          .footer {
              color: #777777;
              font-size: 12px;
              padding-top: 20px;
              border-top: 1px solid #dddddd;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Vraman Sathi Pvt. Ltd.</div>
          <div class="content">
              <p>Dear User,</p>
              <p>Thank you for registering with Vraman Sathi Pvt. Ltd.</p>
              <p>Please use the OTP below to verify your account:</p>
              <div class="otp">${otp}</div>
              <p>This OTP is valid for the next 10 minutes. For your security, please do not share it with anyone.</p>
              <p>If you did not request this code, please ignore this email.</p>
              <p>Thank you,<br>Vraman Sathi Pvt. Ltd. Team</p>
          </div>
          <div class="footer">
              &copy; ${new Date().getFullYear()} Vraman Sathi Pvt. Ltd. All rights reserved.
          </div>
      </div>
  </body>
  </html>
  `;
};