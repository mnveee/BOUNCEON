const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

// Configure NodeMailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// GET: Render landing page
router.get("/", (req, res) => {
  res.render("landing");
});

// POST: Handle "Include me in the list" form submission
router.post("/subscribe", async (req, res) => {
  const { company, email, tel } = req.body;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  try {
    await transporter.sendMail({
      from: `"BounceOn Contact" <${process.env.SMTP_USER}>`,
      to: "bounceon.fun@gmail.com",
      subject: "New Early Bird Subscription",
      text: `New subscription request:\nCompany: ${
        company || "Not provided"
      } \nEmail: ${email}\nPhone: ${tel || "Not provided"}`,
      html: `
        <p><strong>New Early Bird Subscription</strong></p>
        <p><strong>Company:</strong> ${company || "Not provided"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${tel || "Not provided"}</p>
      `,
    });
    res.redirect("/?message=Subscription successful");
  } catch (error) {
    console.error("Error sending subscription email:", error);
    res.redirect("/?error=Failed to subscribe");
  }
});

// POST: Handle "Send Message Now" contact form submission
router.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send("Name, email, and message are required");
  }

  try {
    await transporter.sendMail({
      from: `"BounceOn Contact" <${process.env.SMTP_USER}>`,
      to: "bounceon.fun@gmail.com",
      subject: "New Contact Form Submission",
      text: `New contact form submission:\nName: ${name}\nEmail: ${email}
      }\nCompany: ${subject || "Not provided"}\nMessage: ${message}`,
      html: `
        <p><strong>New Contact Form Submission</strong></p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${subject || "Not provided"}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });
    res.redirect("/?message=Message sent successfully");
  } catch (error) {
    console.error("Error sending contact email:", error);
    res.redirect("/?error=Failed to send message");
  }
});

module.exports = router;
