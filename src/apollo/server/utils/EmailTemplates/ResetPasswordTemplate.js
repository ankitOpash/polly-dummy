export const ResetPasswordTemplate = ({ userName, link }) => `
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

  <p  style="color: #222; margin-bottom: 3px">We noticed you requested to reset your ProCat360 password. No worries, we've got you covered! To create a new password and regain access to your account, please click the following link:</p>
  
  <p><a href=${link}>${link}</a></p>

  <p style="margin: 10px 0px 7px 0px;color: #222;">If you didn't initiate this request, please disregard this email, and your password will remain unchanged.</p>
  <p style="margin: 7px 0px;color: #222;">If you encounter any issues or need further assistance, please don't hesitate to contact our support team at procat360.com</p>
  <p style="color: #222;">Thank you for trusting ProCat360 with your 3D catalog management needs!</p>
  </div>

  <div style="margin: 15px 0px;">
  <p style="margin:0px; color: #222;">Best regards,</p>
  <p style="margin:0px; color: #222;">ProCat360 Team</p>
  </div>
</body>
</html>
`