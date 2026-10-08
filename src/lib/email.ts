
import nodemailer from "nodemailer";

const smtpPort = Number(
  process.env.SMTP_PORT || 587
);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function getFromAddress() {
  return (
    process.env.SMTP_FROM ||
    process.env.SMTP_USER ||
    "Veltra <no-reply@example.com>"
  );
}

export async function sendVerificationEmail({
  email,
  fullName,
  code,
}: {
  email: string;
  fullName: string;
  code: string;
}) {
  await transporter.sendMail({
    from: getFromAddress(),
    to: email,
    subject: "Verify your Veltra account",
    text: `Hello ${fullName},

Your Veltra email verification code is:

${code}

This code expires in 15 minutes.

If you did not create a Veltra account, you can ignore this email.

Regards,
Veltra`,
    html: `
      <div style="background:#050814;padding:40px 20px;font-family:Arial,sans-serif;">
        <div style="max-width:560px;margin:auto;background:#080b1f;border:1px solid #22263d;border-radius:20px;padding:35px;color:#ffffff;">

          <h1 style="margin:0 0 10px;color:#ffffff;">
            Verify your Veltra account
          </h1>

          <p style="color:#a1a1aa;font-size:15px;">
            Hello ${escapeHtml(fullName)},
          </p>

          <p style="color:#a1a1aa;font-size:15px;">
            Use the verification code below to verify your email address.
          </p>

          <div style="
            margin:30px 0;
            padding:20px;
            text-align:center;
            border-radius:14px;
            background:#11152d;
            border:1px solid #2d3354;
          ">
            <div style="
              font-size:34px;
              font-weight:bold;
              letter-spacing:10px;
              color:#ec4899;
            ">
              ${code}
            </div>
          </div>

          <p style="color:#71717a;font-size:13px;">
            This code expires in 15 minutes.
          </p>

          <p style="color:#71717a;font-size:13px;">
            If you did not create a Veltra account, you can safely ignore this email.
          </p>

        </div>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail({
  email,
  fullName,
  code,
}: {
  email: string;
  fullName: string;
  code: string;
}) {
  await transporter.sendMail({
    from: getFromAddress(),
    to: email,
    subject: "Reset your Veltra password",
    text: `Hello ${fullName},

Your Veltra password reset code is:

${code}

This code expires in 10 minutes.

If you did not request a password reset, please ignore this email.

Regards,
Veltra`,
    html: `
      <div style="background:#050814;padding:40px 20px;font-family:Arial,sans-serif;">
        <div style="max-width:560px;margin:auto;background:#080b1f;border:1px solid #22263d;border-radius:20px;padding:35px;color:#ffffff;">

          <h1 style="margin:0 0 10px;">
            Reset your password
          </h1>

          <p style="color:#a1a1aa;">
            Hello ${escapeHtml(fullName)},
          </p>

          <p style="color:#a1a1aa;">
            Use the code below to reset your Veltra password.
          </p>

          <div style="
            margin:30px 0;
            padding:20px;
            text-align:center;
            border-radius:14px;
            background:#11152d;
            border:1px solid #2d3354;
          ">
            <div style="
              font-size:34px;
              font-weight:bold;
              letter-spacing:10px;
              color:#ec4899;
            ">
              ${code}
            </div>
          </div>

          <p style="color:#71717a;font-size:13px;">
            This code expires in 10 minutes.
          </p>

          <p style="color:#71717a;font-size:13px;">
            If you did not request this password reset, you can ignore this email.
          </p>

        </div>
      </div>
    `,
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}