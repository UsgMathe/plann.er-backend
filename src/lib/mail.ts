import nodemailer from 'nodemailer';

export async function getMailClient() {
  const acconunt = await nodemailer.createTestAccount();

  const transport = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: acconunt.user, pass: acconunt.pass },
  });

  return transport;
}
