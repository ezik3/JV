console.log('Loading notification service...');
console.log('Current working directory:', process.cwd());
console.log('Environment variables:', process.env);

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY || 'your-api-key-here'});

console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN);

const twilio = require('twilio');

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  console.error('Twilio credentials are missing!');
  // You might want to throw an error here or handle it appropriately
}

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendVerificationEmail = async (to, code) => {
  try {
    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `Vibe App <noreply@${process.env.MAILGUN_DOMAIN}>`,
      to: [to],
      subject: "Verify your email",
      text: `Your verification code is: ${code}`,
      html: `<strong>Your verification code is: ${code}</strong>`
    });
    console.log('Verification email sent:', result);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

const sendVerificationSMS = async (to, code) => {
  try {
    await twilioClient.messages.create({
      body: `Your verification code is: ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
    console.log('Verification SMS sent');
  } catch (error) {
    console.error('Error sending verification SMS:', error);
    throw error;
  }
};

module.exports = { sendVerificationEmail, sendVerificationSMS };