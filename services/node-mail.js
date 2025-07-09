const Sib = require('sib-api-v3-sdk');
require('dotenv').config();

const sendEmail = async (receiverEmail, resetLink) => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY is missing! Check your .env file.");
    }

    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.API_KEY;

    const tranEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
      email: "aamirjawed682@gmail.com",
      name: "Expense Tracker"
    };

    const receiver = [
      { email: receiverEmail }
    ];

    console.log(`Sending email to ${receiverEmail}...`);

    const response = await tranEmailApi.sendTransacEmail({
  sender,
  to: receiver,
  subject: "Forgot your password?",
  textContent: `Click the link below to reset your password:\n${resetLink}`,
  htmlContent: `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
});


    console.log('Email sent successfully:', response);
    return response;

  } catch (error) {
    console.error('Error sending email:', error.response?.body || error.message || error);
    throw error; 
  }
};

module.exports = sendEmail;
