import nodemailer from 'nodemailer';
import { EmailOptions } from '../interfaces/emailInterface';
import { CONFIG } from "../constants/config";
import fs from 'fs';
import path from 'path';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: CONFIG.EMAIL_USER,
        pass: CONFIG.EMAIL_PASS,
    },
});

export const sendEmail = async (options: EmailOptions): Promise<void> => {
    const mailOptions = {
        from: CONFIG.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error sending email');
    }
};

export const sendWelcomeEmail = async (userEmail: string, username: string) => {
    const templatePath = path.join(__dirname, '../templates/welcomeEmail.html');
    console.log('templatePath:', templatePath);
    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

    // Replace placeholders globally
    htmlTemplate = htmlTemplate.replace(/{{username}}/g, username);

    const emailOptions = {
        to: userEmail,
        subject: 'Welcome to Our Service',
        text: 'Thank you for signing up for our service!',
        html: htmlTemplate,
    };

    try {
        await sendEmail(emailOptions);
        console.log('Welcome email sent successfully');
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};

export const sendReminderEmail = async (
    userEmail: string,
    username: string,
    eventTitle: string,
    eventTime: Date
) => {
    const templatePath = path.join(__dirname, '../templates/reminderEmail.html');
    console.log("aashish templatePath", templatePath);

    let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

    // Replace placeholders globally
    htmlTemplate = htmlTemplate
        .replace(/{{username}}/g, username)
        .replace(/{{eventTitle}}/g, eventTitle)
        .replace(/{{eventTime}}/g, eventTime.toLocaleString());

    const emailOptions = {
        to: userEmail,
        subject: `Reminder: ${eventTitle} is starting soon!`,
        text: `Hi ${username}, your event "${eventTitle}" is scheduled for ${eventTime.toLocaleString()}.`,
        html: htmlTemplate,
    };

    try {
        await sendEmail(emailOptions);
        console.log("Reminder email sent successfully");
    } catch (error) {
        console.error("Error sending reminder email:", error);
        throw new Error("Error sending reminder email");
    }
};