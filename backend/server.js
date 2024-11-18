// server.js
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";
import db from "./db.js";
import { User, Job } from "./models.js";
import { eq } from "drizzle-orm";

const app = express();
app.use(cors());
app.use(express.json());

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, "your_jwt_secret", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

const router = express.Router();

app.get("/", (req, res) => {
  res.json({
    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});

// Auth routes
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    const user = await db.insert(User).values({
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user from the database
    const user = await db.select().from(User).where(eq(User.email, email));

    if (!user || !(await bcrypt.compare(password, user[0].password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user[0].id, email: user[0].email },
      "your_jwt_secret",
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Jobs routes
router.get("/jobs", authenticateToken, async (req, res) => {
  try {
    // Fetch all jobs from the database
    const jobs = await db.select().from(Job).where(eq(Job.userId, req.user.id));
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

router.get("/alljobs", async (req, res) => {
  try {
    // Fetch all jobs from the database
    const jobs = await db.select().from(Job);
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

router.post("/jobs", authenticateToken, async (req, res) => {
  const { title, description, location, category, salary, type } = req.body;

  try {
    // Insert a new job into the database
    const job = await db.insert(Job).values({
      title,
      description,
      location,
      category,
      job_type: type,
      salary: salary,
      userId: req.user.id,
    });
    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating job" });
  }
});

router.get("/jobs/:id", authenticateToken, async (req, res) => {
  try {
    // Fetch a specific job by ID
    const job = await db
      .select()
      .from(Job)
      .where(eq(Job.id, parseInt(req.params.id)));

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching job" });
  }
});

router.put("/jobs/:id", authenticateToken, async (req, res) => {
  const { title, description, location, category, salary, job_type } = req.body;

  try {
    // Fetch job to check ownership
    const job = await db
      .select()
      .from(Job)
      .where(eq(Job.id, parseInt(req.params.id)));

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job[0].userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update the job
    const updatedJob = await db
      .update(Job)
      .set({ title, description, location, category, salary, job_type })
      .where(eq(Job.id, job[0].id));
    res.json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating job" });
  }
});

router.delete("/jobs/:id", authenticateToken, async (req, res) => {
  try {
    // Fetch job to check ownership
    const job = await db
      .select()
      .from(Job)
      .where(eq(Job.id, parseInt(req.params.id)));

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job[0].userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete the job
    await db.delete(Job).where(eq(Job.id, job[0].id));
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting job" });
  }
});

app.use("/api/", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
