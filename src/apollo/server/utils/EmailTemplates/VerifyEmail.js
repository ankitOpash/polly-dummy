export const VerifyEmailTemplate = ({ newEmail, userName, link }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invite User</title>
</head>
<body>
<p >Dear ${userName}</p>
  <div style="margin: 15px 0px;">
  <p style="color: #222;">We wanted to confirm that your ProCat360 account email address has been successfully updated to ${newEmail}. From now on, you'll receive all communication and login instructions at this new email address.</p>

  <p  style="color: #222; margin-bottom: 5px">To confirm the email change, please click the following link: </p>
  <p><a href=${link}>${link}</a></p>

  <p style="margin: 7px 0px;color: #222;">If you didn't make this change or have any concerns about your account security, please contact our support team immediately at procat360.com.</p>
  <p style="color: #222;">Thank you for trusting ProCat360 with your 3D catalog management needs!</p>
  </div>

  <div style="margin: 15px 0px;">
  <p style="margin:0px; color: #222;">Best regards,</p>
  <p style="margin:0px; color: #222;">ProCat360 Team</p>
  </div>
</body>
</html>
`