import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // SMTP username
    pass: process.env.SMTP_PASS, // SMTP password
  },
});

export async function sendAdminCommentEmail(to, shipmentCode, comment) {
  const mailOptions = {
    from: `"HipTrack" <${process.env.SMTP_USER}>`,
    to,
    subject: `New Admin Comment for Shipment ${shipmentCode}`,
    html: `
      <p>Hello,</p>
      <p>An important comment has been added to your shipment <strong>${shipmentCode}</strong>:</p>
      <blockquote style="border-left: 3px solid #ff0000; padding-left: 10px; color: #b91c1c;">
        ${comment}
      </blockquote>
      <p>You can check the full shipment details <a href="https://hiptrack-global.vercel.app/tracking/${shipmentCode}">here</a>.</p>
      <p>– HipTrack Team</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}
