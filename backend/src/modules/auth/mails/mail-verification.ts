export default function emailHtml(body: string, verificationLink: string) {
  return `
      <!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 2px solid #eeeeee;
    }
    .header h1 {
      color: #333333;
    }
    .content {
      color: #333333;
      line-height: 1.6;
      padding: 0 20px;
    }
    .button-container {
      text-align: center;
      margin-top: 20px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      font-size: 16px;
      color: #ffffff;
      background-color: #007bff;
      text-decoration: none;
      border-radius: 5px;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      border-top: 2px solid #eeeeee;
      font-size: 14px;
      color: #666666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Email Verification</h1>
    </div>
    <div class="content">
      <p>Hello ${body},</p>
      <p>Thank you for registering with us. To complete your registration, please verify your email address by clicking the button below:</p>
      <div class="button-container">
        <a href="${verificationLink}" class="button">Verify Email</a>
      </div>
      <p>If you did not register for this account, please disregard this email.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Your Company Name. All rights reserved.</p>
    </div>
  </div>
</body>
</html>


    `;
}
