import nodemailer from "nodemailer";

 /**
 * Sends an email requirements.
 * Environment variable 
 * MAIL_HOST=""
   MAIL_PORT=587
   MAIL_USER="info@amplifiedamino.us"
   MAIL_PASSWORD="tywnDMWt1TWCJWc"
 * 
 * mailDetails
 * @param {string} subject - Email subject.
 * @param {string} htmlContent - HTML content of the email.
 * @param {Array} attachments - Array of attachment objects (optional).
 * 
 * sendEmail
 * @param {string} to - Recipient email address.
 */

class EmailService {
    constructor() {
        this.subject = 'Welcome to Amplified Amino!'
        this.body = `<html>
            <body>
            <h1>Welcome to Amplified Amino!</h1>
            <p>Here's the document you requested.</p>
            </body>
        </html>`
        this.attachments = []
        
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: process.env.MAIL_PORT == 465, 
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });
    }

    emailDetails(subject, htmlContent, attachments = []){
        this.subject = subject
        this.body = htmlContent
        this.attachments = attachments
    }

    
    async sendEmail(to) {
        try {
            const info = await this.transporter.sendMail({
                from: `"Amplified Amino" <${process.env.MAIL_USER}>`,
                to, 
                subject: this.subject, 
                html: this.body, 
                attachments: this.attachments,
            });

            return info
        } catch (error) {
            throw new Error(error)
        }
    }
}

export class OrderEmailNotification extends EmailService {
    constructor(order, createdAt) {
        super();  // Ensure super() is called to initialize the parent class
        this.createdAt = new Date(createdAt);
        this.paidAt = new Date();
        this.order_id = order;
        this.email_to = "nazmul291@gmail.com"

        this.sendNotification = this.sendNotification.bind(this);
    }

    // Method to check if the order has expired
    isexpired(days = 2) {
        const expirationDate = new Date(this.createdAt);
        expirationDate.setDate(expirationDate.getDate() + days);
        return expirationDate < this.paidAt;
    }

    formateDate(date){
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
        return formattedDate

    }

    async sendNotification() {
        try {
            if (this.isexpired(2)) {
                this.subject = `Payment received`;  // Fixed typo "receved"
                this.body = `<html>
                    <body>
                    <h1>Thank you for your payment!</h1>
                    <p>Your order ID is ${this.order_id || "#001"}, and the payment was received on ${this.formateDate(this.paidAt)}.</p>
                    </body>
                </html>`;

                const emailInfo = await this.sendEmail(this.email_to); 
                return emailInfo
            } else {
                return false
            }
        } catch (error) {
            throw new Error(error)
        }
    }
}



export default EmailService;

/**
 * Example usage of emailService: 
 * 
 * import EmailService from './emailService.js';

    const emailService = new EmailService();

    const subject = 'Welcome to Amplified Amino!'

    // Example HTML content
    const emailContent = `
    <html>
        <body>
        <h1>Welcome to Amplified Amino!</h1>
        <p>Here's the document you requested.</p>
        </body>
    </html>
    `;

    // Attachments (adjust the paths and filenames as needed)
    
    const attachments = [
        {
            filename: 'example.pdf', // File name as it will appear in the email
            path: './attachments/example.pdf', // Path to the file
        },
        {
            filename: 'image.png',
            path: './attachments/image.png',
        },
    ];

    emailService.emailDetails(subject, emailContent, attachments)

    // Send email with attachments
    (async () => {
        await emailService.sendEmail('client@example.com');
    })();

 * 
 */

