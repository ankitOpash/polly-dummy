const aws = require('aws-sdk');
const _ = require("lodash");
const nodemailer = require('nodemailer');

aws.config.update({
  accessKeyId: process.env.AWS_SES_CONFIG_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SES_CONFIG_SECRET_ACCESS_KEY,
  region: process.env.AWS_SES_REGION
});

const ses = new aws.SES();
const myEmail = process.env.EMAIL;

let _EmailHelper = function () {

  this.emailNotification = async (data) => {
    try {

      this.generateEmailComposerParams = ({ senderName, body, to, subject, bcc, cc, source, attachments }) => {
        return {
          // from: source ? source : senderName ? `${senderName} via Procat360<noreply@${myEmail}>` : `Procat360<noreply@${myEmail}>`,
          from: `Procat360<noreply@${myEmail}>`,
          to: _.isArray(to) ? to : [to],
          cc: _.isArray(cc) ? cc : [],
          bcc: _.isArray(bcc) ? bcc : [],
          subject: subject,
          html: body,
          attachments: attachments,
          textEncoding: "UTF-8"
        }
      }

      let transporter = await nodemailer.createTransport({
        SES: ses
      })

      const mailOptions = this.generateEmailComposerParams(data);
      await transporter.sendMail(mailOptions);
    } catch (e) {
      console.log('=====e', e)
    }
  }
}

export const EmailHelper = new _EmailHelper()