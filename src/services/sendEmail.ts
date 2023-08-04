import * as Nodemailer from 'nodemailer';
import { env } from 'process';

interface SendEmailParams {
  email: string,
  url: string,
  message?: string,
  buttonText?: string
  subject?: string
  companyName?: string
}
// async..await is not allowed in global scope, must use a wrapper
export default async function sendEmail({ email, url, message = "verify your email address", buttonText = "Confirm Email", subject = "Account Verification", companyName = process.env.COMPANY_NAME }: SendEmailParams): Promise<any> {

  let transporter = Nodemailer.createTransport({
    name: "www.marlayer.cloud",  //www.agronigeria.ng
    host: "smtppro.zoho.com",  //mail.agronigeria.ng
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "account_verification@marlayer.cloud", //no-reply@agronigeria.ng
      pass: "6eq%tUzv", //AgroNigA!!en90
    },
  });

  let mailDetails = {
    from: 'account_verification@marlayer.cloud',
    to: `${email}`,
    subject: `${subject} Link`,
    text: 'Follow the instructions below',
    html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center;">
            <h1>${companyName}</h1>
            <p>Click on the button below to ${message}</p>
            <a
            href="${url}"
            target="_blank"
            style="display: block; width: 250px; border-radius: 25px; border: 1px solid #1942D8; background: #1942D8; color: white; margin: 30px auto; text-align: center; padding: 15px 0px">
            ${buttonText}
            </a>
            <p style="line-height: 1.3rem;">
            Thanks <br />
            <em>The Marlayer Cloud Services Team</em>
            </p>
        </div>
        `
  };
  let info = await transporter.sendMail(mailDetails);
  if (info) {
    return {
      success: true,
      message: `Check your email: ${email}, click on the button to ${message}`
    }
  }

}