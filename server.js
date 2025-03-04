require('dotenv').config(); // Load environment variables
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or your email provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Email sending route
app.post('/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Read the HTML template
    let htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Portfolio Contact</title>
        <style type="text/css">
            body, table, td, a { 
                -webkit-text-size-adjust: 100%; 
                -ms-text-size-adjust: 100%; 
            }
            table, td { 
                mso-table-lspace: 0pt; 
                mso-table-rspace: 0pt; 
            }
            img { 
                -ms-interpolation-mode: bicubic; 
            }
            img { 
                border: 0; 
                height: auto; 
                line-height: 100%; 
                outline: none; 
                text-decoration: none; 
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; background-color: #f4f4f4;">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="border-collapse: collapse; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 8px;">
                        <tr>
                            <td style="background-color: #4361ee; color: white; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                                <h1 style="margin: 0; font-size: 24px;">New Portfolio Contact</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 30px;">
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                                    <tr>
                                        <td style="padding-bottom: 20px;">
                                            <h2 style="margin: 0; color: #333; font-size: 18px; border-bottom: 2px solid #4361ee; padding-bottom: 10px;">Message Details</h2>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                                                <tr>
                                                    <td style="width: 150px; color: #666; padding: 10px 0; font-weight: bold;">Name:</td>
                                                    <td style="padding: 10px 0; color: #333;">${name}</td>
                                                </tr>
                                                <tr>
                                                    <td style="width: 150px; color: #666; padding: 10px 0; font-weight: bold;">Email:</td>
                                                    <td style="padding: 10px 0; color: #333;">${email}</td>
                                                </tr>
                                                <tr>
                                                    <td style="width: 150px; color: #666; padding: 10px 0; font-weight: bold;">Subject:</td>
                                                    <td style="padding: 10px 0; color: #333;">${subject}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 20px;">
                                            <h2 style="margin: 0; color: #333; font-size: 18px; border-bottom: 2px solid #4361ee; padding-bottom: 10px;">Message</h2>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 15px 0; color: #333; line-height: 1.6;">
                                            ${message}
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #f4f4f4; color: #666; text-align: center; padding: 15px; font-size: 12px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                                © 2025 Portfolio Contact Form. This is an automated message.
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECIPIENT_EMAIL,
        subject: `New Portfolio Contact: ${subject}`,
        html: htmlTemplate
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ message: 'Failed to send email', error: error.toString() });
    }
});

// Root route for testing
app.get('/', (req, res) => {
    res.send('Portfolio Backend Server is running!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});