export const emailTemplate = (otp: number) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Verify Your Account - ShopEase</title>
</head>

<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial, Helvetica, sans-serif;">

<table align="center" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;margin-top:40px;border-radius:12px;overflow:hidden;box-shadow:0 4px 25px rgba(0,0,0,0.05);">

<tr>
<td style="background: linear-gradient(135deg, #1e293b, #0f172a); padding: 30px; text-align: center;">
<h2 style="color:#ffffff; margin:0; font-size: 26px; letter-spacing: 1px;">
🛒 ShopEase
</h2>
<p style="color:#94a3b8; font-size:14px; margin-top:5px; margin-bottom:0;">
Your Ultimate Shopping Destination
</p>
</td>
</tr>

<tr>
<td style="padding:40px 30px; text-align:center;">

<p style="color:#1e293b; font-size:18px; font-weight: bold; margin-top:0; margin-bottom:10px;">
Welcome to the family! 🎉
</p>

<p style="color:#64748b; font-size:15px; line-height: 1.5; margin-bottom:0;">
Thank you for creating an account with us. Please use the verification code below to activate your account and start shopping your favorite products!
</p>

<div style="
background:#f8fafc;
border:2px dashed #cbd5e1;
border-radius:10px;
padding:20px;
margin:30px 0;
font-size:32px;
letter-spacing:6px;
font-weight:bold;
color:#ff6b6b;
">
${otp}
</div>

<p style="color:#94a3b8; font-size:13px; margin-bottom:0;">
This code is valid for a limited time. For security reasons, please do not share this code with anyone.
</p>

</td>
</tr>

<tr>
<td style="background:#f8fafc; border-top: 1px solid #f1f5f9; padding:25px; text-align:center;">

<p style="color:#64748b; font-size:13px; margin:0;">
Happy Shopping! 🛍️
</p>

<p style="color:#94a3b8; font-size:12px; margin-top:10px; margin-bottom:0;">
© 2026 ShopEase Inc. All rights reserved.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>`;
};