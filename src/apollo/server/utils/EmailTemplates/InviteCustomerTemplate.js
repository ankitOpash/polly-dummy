export const InviteCustomerTemplate = ({ link, userData }) => `

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <p>Hello ${userData?.userName},</p>

  <p style="margin:15px 0px;">${userData?.invitedBy ? `
    ${userData?.invitedBy} has invited you as a customer in procat360
  ` : ""}
  </p>
  <div>

    <p style='margin: 5px 0px 0px 0px;'>Email: ${userData?.email}</p>
    <p style='margin: 0px;'>Temporary Password: ${userData?.password}</p>

    <p style="margin:15px 0px;">If you don't have a ProCat360 account yet, you'll be prompted to create one during the acceptance process.</p>
    <p>Welcome to the team, and let's create amazing 3D catalogs together!</p>
  </div>
  <div style='margin:15px 0px;'>
  <p style='margin: 0px;'>Best regards,</p>
  <p style='margin: 0px;'>ProCat360 Team</p>
  </div>
</body>
</html>

`