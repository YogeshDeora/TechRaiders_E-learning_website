const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json()); // ✅ No need for bodyParser.json()

const SECRET_KEY = "your_secret_key";
const usersFilePath = path.join(__dirname, "users.json" );

const otpFilePath = path.join(__dirname, "otp.json");

// Ensure files exist
const ensureFileExists = (filePath, defaultValue) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), "utf8");
  }
};
ensureFileExists(usersFilePath, []);
ensureFileExists(otpFilePath, {});

// Load & Save Users
const loadUsers = () => JSON.parse(fs.readFileSync(usersFilePath, "utf8") || "[]");
const saveUsers = (users) => fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf8");

// Load & Save OTPs
const loadOtps = () => JSON.parse(fs.readFileSync(otpFilePath, "utf8") || "{}");
const saveOtps = (otps) => fs.writeFileSync(otpFilePath, JSON.stringify(otps, null, 2), "utf8");

// 📌 Signup API
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "All fields are required." });

  let users = loadUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ message: "User already exists. Please login." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ name, email: email.toLowerCase(), password: hashedPassword });
  saveUsers(users);

  res.json({ message: "Signup successful! Please login." });
});

// 📌 Send OTP API
app.post("/api/send-otp", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  const users = loadUsers();
  if (!users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ message: "User not found. Please sign up." });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  let otps = loadOtps();
  otps[email.toLowerCase()] = otp;
  saveOtps(otps);

  console.log(`OTP for ${email}: ${otp}`); // Debugging
  res.json({ message: "OTP sent successfully!" });
});

// 📌 Login API (Check Password First)
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

  const users = loadUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  res.json({ message: "Password verified! Now enter OTP.", email });
});

// 📌 Verify OTP & Generate Token
app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required." });

  let otps = loadOtps();
  if (otps[email.toLowerCase()] !== otp) {
    return res.status(400).json({ message: "Invalid OTP. Try again." });
  }

  delete otps[email.toLowerCase()];
  saveOtps(otps);

  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });

  let users = loadUsers();
  let userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (userIndex !== -1) {
    users[userIndex].token = token;
    saveUsers(users);
  }

  res.json({ message: "Login successful!", token });
});

// 📌 Logout API
app.post("/api/logout", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  let users = loadUsers();
  let userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());

  if (userIndex !== -1) {
    delete users[userIndex].token;
    saveUsers(users);
  }

  res.json({ message: "Logged out successfully!" });
});
app.get("/user", (req, res) => {
  res.json({ name: "John Doe", email: "john@example.com", enrolledCourses: [] });
});

// 📌 Get User Data
app.get("/api/user", (req, res) => {
  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read user data" });
    res.json(JSON.parse(data));
  });
});

// 📌 Update User Data
app.post("/api/user", (req, res) => {
  fs.writeFile(usersFilePath, JSON.stringify(req.body, null, 2), (err) => {
    if (err) return res.status(500).json({ error: "Failed to save user data" });
    res.json({ message: "User data updated successfully" });
  });
});

// 📌 Courses API - Get all courses
app.get("/api/courses", (req, res) => {
  const courses = [
    {
      _id: "1",
      courseTitle: "React for Beginners",
      courseThumbnail: "https://via.placeholder.com/150",
      creator: { name: "John Doe", photoUrl: "https://via.placeholder.com/40" },
      courseLevel: "Beginner",
      coursePrice: 499,
    },
    {
      _id: "2",
      courseTitle: "Advanced Node.js",
      courseThumbnail: "https://via.placeholder.com/150",
      creator: { name: "Jane Smith", photoUrl: "https://via.placeholder.com/40" },
      courseLevel: "Advanced",
      coursePrice: 999,
    },
  ];

  res.json({ courses });
});

// 📌 Start Server
const PORT = 8000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
