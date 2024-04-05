export const WelcomeEmailTemplate = ({ userName, link }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invite User</title>
</head>
<body>
  <p>Dear ${userName}</p>
  <div style="margin: 15px 0px;">
  <p style="color: #222;">Welcome to ProCat360! We're thrilled to have you on board as part of our growing community of 3D catalog enthusiasts. With ProCat360, you're now equipped to effortlessly manage and showcase your 3D catalogs.</p>

  <p style="margin:10px 0px; color: #222;">Here's what you can do right away:</p>
  <ul>
    <li style="margin:0px; color: #222; list-style-type:circle;">Upload Your 3D Models: Get started by uploading your 3D models to create stunning catalogs.</li>
    <li style="margin:0px; color: #222; list-style-type:circle;">Customize Your Catalog: Personalize your catalog's look and feel to match your brand.</li>
    <li style="margin:0px; color: #222; list-style-type:circle;">Share and Collaborate: Invite team members to collaborate and start sharing your catalogs.</li>
  </ul>
  <p style="color: #222; margin: 8px 0px;">Ready to get started? Simply log in with the credentials you used during signup: </p>
  <p><a href=${link}>${link}</a></p>

  <p style="margin: 8px 0px;color: #222;">If you have any questions or need assistance along the way, our support team is here to help. Feel free to reach out anytime at procat360.com</p>
  <p style="color: #222;">Thank you for choosing ProCat360. Let's elevate your 3D catalogs together!</p>
  </div>

  <div style="margin: 15px 0px;">
  <p style="margin:0px; color: #222;">Best regards,</p>
  <p style="margin:0px; color: #222;">ProCat360 Team</p>
  </div>
</body>
</html>
`