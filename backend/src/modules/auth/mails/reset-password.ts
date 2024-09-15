export default function resetMail(resetLink: string) {
  return `

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #fff;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333;
    }
    a {
      color: #3498db;
      text-decoration: none;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      font-size: 16px;
      font-weight: bold;
      color: #fff;
      background-color: #3498db;
      border-radius: 5px;
      text-align: center;
      text-decoration: none;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Password Reset Request</h1>
    <p>Hello,</p>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>
    <a href="${resetLink}" class="button">Reset Password</a>
    <p>If you didn't request this change, please ignore this email.</p>
    <p class="footer">This link will expire in 1 hour.</p>
  </div>
</body>
</html>
`;
}
