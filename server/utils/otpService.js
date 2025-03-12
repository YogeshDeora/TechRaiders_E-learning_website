// require("dotenv").config();
// const fs = require("fs");
// const path = require("path");
// const nodemailer = require("nodemailer");
// const jwt = require("jsonwebtoken");

// const otpFilePath = path.join(__dirname, "../otp.json"); // Store OTPs

// const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

// // Ensure otp.json exists
// if (!fs.existsSync(otpFilePath)) fs.writeFileSync(otpFilePath, JSON.stringify({}), "utf8");

// // Load OTPs
// const loadOtps = () => {
//   try {
//     const fileData = fs.readFileSync(otpFilePath, "utf8");
//     return fileData.trim() ? JSON.parse(fileData) : {};
//   } catch (error) {
//     console.error("Error reading otp.json:", error);
//     return {};
//   }
// };

// // Save OTPs
// const saveOtps = (otps) => {
//   try {
//     fs.writeFileSync(otpFilePath, JSON.stringify(otps, null, 2), "utf8");
//   } catch (error) {
//     console.error("Error writing to otp.json:", error);
//   }
// };

// // Configure Nodemailer Transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS, // Use Gmail App Password (Not your actual password)
//   },
// });

// // Verify SMTP Connection
// transporter.verify((error, success) => {
//   if (error) {
//     console.error("SMTP Connection Failed:", error);
//   } else {
//     console.log("SMTP Connected Successfully!");
//   }
// });

// // Generate a 6-digit OTP
// const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// // Send OTP
// const sendOtp = async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       return res.status(400).json({ message: "Email is required." });
//     }

//     const otp = generateOtp();
//     const expiry = Date.now() + OTP_EXPIRY_TIME; // Set expiry time

//     let otps = loadOtps();
//     otps[email] = { otp, expiry };
//     saveOtps(otps); // Store OTP with expiry

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Your OTP Code",
//       text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`OTP sent to ${email}: ${otp}`);

//     res.json({ message: "OTP sent successfully." });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res.status(500).json({ message: `Failed to send OTP: ${error.message}` });
//   }
// };

// // Verify OTP
// const verifyOtp = (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     if (!email || !otp) {
//       return res.status(400).json({ message: "Email and OTP are required." });
//     }

//     let otps = loadOtps();
//     const storedOtpData = otps[email];

//     if (!storedOtpData) {
//       return res.status(400).json({ message: "No OTP found for this email." });
//     }

//     const { otp: storedOtp, expiry } = storedOtpData;

//     if (Date.now() > expiry) {
//       delete otps[email];
//       saveOtps(otps);
//       return res.status(400).json({ message: "OTP has expired." });
//     }

//     if (storedOtp !== otp) {
//       return res.status(400).json({ message: "Invalid OTP." });
//     }

//     delete otps[email];
//     saveOtps(otps);

//     const token = jwt.sign({ email }, process.env.SECRET_KEY || "your_secret_key", { expiresIn: "1h" });
//     res.json({ message: "Login successful!", token });
//   } catch (error) {
//     console.error("OTP Verification Error:", error);
//     res.status(500).json({ message: `Error verifying OTP: ${error.message}` });
//   }
// };

// module.exports = { sendOtp, verifyOtp };
