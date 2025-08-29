const transporter = require("../config/email");

const sendEmail = async ({to, subject, html, attachments = []}) => {
  const mailOptions = {
    from: `"Event Booking App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html, // ✅ send rich HTML content instead of plain text
    attachments, // ✅ supports array of attachments
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.response}`);
  } catch (error) {
    console.error("❌ Email sending failed:");
    console.error(error.message); // concise
    console.error("Full error:", error); // detailed
  }
};

module.exports = sendEmail;
