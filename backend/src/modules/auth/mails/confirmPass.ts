export default function emailHtml(body: string) {
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

    </style>
  </head>
  <body>
    <div class="container">
        <h3>Hello,</h3>
        <p>Your password has been successfully updated.</p>
    </div>
  </body>
  </html>
    `;
}
