require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const nodemailer = require("nodemailer");



const interviewRoutes = require("./controllers/interviewController");

const placementRoutes = require("./controllers/placement");

const round2controller = require("./routes/round2Routes");

const resourceRoutes = require("./routes/resourceRoutes");

const PlacementSession = require("./routes/recuriter_routes");

const collegeFinderRoute = require("./routes/collegeFinderRoute");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// serve frontend optionally if you move frontend into backend/public
// app.use(express.static(path.join(__dirname, "..", "frontend")));

app.use("/api/interview", interviewRoutes);

// small route to confirm server
app.get("/", (req, res) => res.send("AI Interview backend"));

app.use("/api/placement", placementRoutes);

//app.use("/api/placement", require("./controllers/placementRoutes"));

app.use("/api/placement", round2controller);

app.use("/api/resources", resourceRoutes);

app.use("/api/recruiter", PlacementSession);

app.use("/api/college-finder", collegeFinderRoute);


// Students data moved to database and route moved to routes/recuriter_routes.js

// ---------- API: send mail ----------
app.use("/api/recruiter", require("./routes/recruiter"));

// ---------- Serve resume files using local paths from session history ----------
// NOTE: these paths reference the uploaded file paths in your session.
// The developer instruction asked to include the recorded path and let your infra convert it.
// We'll map a few known resume keys to those files.
const resumeMap = {
  riya: "/mnt/data/0a2ad97a-193b-4d7e-9b6e-5e71275c3d37.png",
  arjun: "/mnt/data/28fee6e4-c6ce-45b3-a846-831ba9e16270.png",
  sneha: "/mnt/data/0a2ad97a-193b-4d7e-9b6e-5e71275c3d37.png",
  karan: "/mnt/data/28fee6e4-c6ce-45b3-a846-831ba9e16270.png",
  neha: "/mnt/data/0a2ad97a-193b-4d7e-9b6e-5e71275c3d37.png",
  rahul: "/mnt/data/28fee6e4-c6ce-45b3-a846-831ba9e16270.png",
  pooja: "/mnt/data/0a2ad97a-193b-4d7e-9b6e-5e71275c3d37.png",
  vikram: "/mnt/data/28fee6e4-c6ce-45b3-a846-831ba9e16270.png",
  anjali: "/mnt/data/0a2ad97a-193b-4d7e-9b6e-5e71275c3d37.png",
  rohan: "/mnt/data/28fee6e4-c6ce-45b3-a846-831ba9e16270.png"
};

app.get('/resume/:id', (req, res) => {
  const id = req.params.id;
  const file = resumeMap[id];
  if (!file) return res.status(404).send("Resume not found");
  // send file directly (path is absolute in our mapping)
  res.sendFile(file, err => {
    if (err) {
      console.error("sendFile error:", err);
      res.status(500).send("Error sending file");
    }
  });
});

// fallback for SPA pages
app.get('*', (req, res, next) => {
  // let static serve first; if no static file, skip
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'frontend', 'recruiter_login.html'));
});



const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1);
  });
