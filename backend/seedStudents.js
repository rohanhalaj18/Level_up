require("dotenv").config();
const mongoose = require("mongoose");
const Student = require("./models/Student");

const students = [
  { name: "Rohan halaj", email: "rohanhalaj@gmail.com", role: "backend Developer", aptitude: 78, coding: 64, interview: { happy: 70, sad: 10, attitude: 85 }, resume: "/resume/rohan" },
  { name: "Arjun Verma", email: "arjun@example.com", role: "frontend Developer", aptitude: 82, coding: 91, interview: { happy: 60, sad: 5, attitude: 92 }, resume: "/resume/arjun" },
  { name: "saish", email: "saish@gmail.com", role: "Fullstack Developer", aptitude: 70, coding: 72, interview: { happy: 55, sad: 8, attitude: 78 }, resume: "/resume/saish" },
  { name: "Karan Rao", email: "karan@example.com", role: "Data Scientist", aptitude: 88, coding: 84, interview: { happy: 80, sad: 5, attitude: 90 }, resume: "/resume/karan" },
  { name: "Neha Patel", email: "neha@example.com", role: "QA Engineer", aptitude: 66, coding: 58, interview: { happy: 44, sad: 12, attitude: 60 }, resume: "/resume/neha" },
  { name: "Rahul Singh", email: "rahul@example.com", role: "DevOps Engineer", aptitude: 75, coding: 70, interview: { happy: 50, sad: 6, attitude: 72 }, resume: "/resume/rahul" },
  { name: "Pooja Mehta", email: "pooja@example.com", role: "UI/UX Designer", aptitude: 69, coding: 52, interview: { happy: 77, sad: 3, attitude: 80 }, resume: "/resume/pooja" },
  { name: "Vikram Joshi", email: "vikram@example.com", role: "ML Engineer", aptitude: 91, coding: 87, interview: { happy: 82, sad: 2, attitude: 94 }, resume: "/resume/vikram" },
  { name: "Anjali Desai", email: "anjali@example.com", role: "Cloud Engineer", aptitude: 73, coding: 69, interview: { happy: 65, sad: 7, attitude: 75 }, resume: "/resume/anjali" },
  { name: "Rohan K", email: "rohan@example.com", role: "Intern - Backend", aptitude: 60, coding: 58, interview: { happy: 40, sad: 20, attitude: 50 }, resume: "/resume/rohan" }
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    try {
      await Student.deleteMany({}); // Clear existing data
      console.log("Cleared existing students");
      await Student.insertMany(students);
      console.log("Seeded students successfully");
    } catch (err) {
      console.error("Error seeding data:", err);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1);
  });
