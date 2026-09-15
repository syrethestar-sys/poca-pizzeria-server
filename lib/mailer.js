import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;

const transporter =
  SMTP_HOST && SMTP_USER && SMTP_PASS
    ? nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      })
    : null;

export const sendPasswordResetEmail = async (to, resetUrl) => {
  if (!transporter) {
    console.log(`[mailer] SMTP is not configured. Reset link for ${to}: ${resetUrl}`);
    return;
  }

  await transporter.sendMail({
    from: MAIL_FROM || SMTP_USER,
    to,
    subject: "Reset your Poca Pizzeria password",
    text: `Use this link to reset your password: ${resetUrl}\n\nThis link expires in 30 minutes. If you did not request this, ignore this email.`,
    html: `<p>Use this link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 30 minutes. If you did not request this, ignore this email.</p>`,
  });
};
