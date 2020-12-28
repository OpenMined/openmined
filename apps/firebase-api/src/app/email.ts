import { logger } from 'firebase-functions';
import nodemailer from 'nodemailer';

const contentTypes = {
  createAccount: (data) => ({
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>', // html body
  }),
  deleteAccount: (data) => ({
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>', // html body
  }),
  startCourse: (data) => ({
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>', // html body
  }),
  receivePassedReview: (data) => ({
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>', // html body
  }),
  receiveFailedReview: (data) => ({
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>', // html body
  }),
};

export const sendEmail = async (type: string, user: string, data: any) => {
  try {
    const transporter = await nodemailer.createTransport({
      host: 'email-smtp.us-east-1.amazonaws.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.NX_EMAIL_AUTH_USER,
        pass: process.env.NX_EMAIL_AUTH_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"OpenMined" <no-reply@openmined.org>',
      to: user,
      ...contentTypes[type](data),
    });
  } catch (error) {
    logger.error('Problem sending email', error);
  }
};
