import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';

type Payload = {
  name: string;
  link?: string;
};

export const sendPasswordResetEmail = async (email: string, subject: string, payload: Payload) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: false,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });


    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'Mailgen',
        link: 'https://mailgen.js/',
      },
    });

    var resetEmail: any = {
      body: {
        name: payload.name,
        intro: 'You have received this email because a password reset request for your account was received.',
        action: {
          instructions: 'Click the button below to reset your password:',
          button: {
            color: '#DC4D2F',
            text: 'Reset your password',
            link: payload?.link,
          },
        },
        outro: 'If you did not request a password reset, no further action is required on your part.',
      },
    };

    const mail = mailGenerator.generate(resetEmail);


    const options = () => {
      return {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: subject,
        html: mail,
      };
      
    };

    const emailStatus = await transporter.sendMail(options());

    if (emailStatus) {
      return 'Check your mailbox to change your password';

    }
  } catch (error) {
    console.info(error);
    return error;
  }
};
