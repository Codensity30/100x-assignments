const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db/index");

const router = Router();
const { jwtSecret } = require("../config/config");
// Admin Routes

//Sign Up route which creates account and store in db
router.post("/signup", async (req, res) => {
  try {
    // encrypting the password using bcrypt
    const password = await bcrypt.hash(req.body.password, 10);

    // storing the user in the db
    await Admin.create({
      username: req.body.username,
      password: password,
    });

    res.json({ msg: "Admin created successfully" });
  } catch (error) {
    res.sendStatus(500);
  }
});

// Sign In route which on successful sign in returns the jwt
router.post("/signin", async (req, res) => {
  try {
    const admin = await Admin.findOne({ username: req.body.username });
    if (!admin) {
      res.status(401).json({ error: "Invalid email" });
      return;
    }
    const result = await bcrypt.compare(req.body.password, admin.password);
    if (!result) {
      res.status(401).json({ error: "Invalid password or email" });
      return;
    }
    const token = jwt.sign({ username: admin.username }, jwtSecret);
    res.json({ token: token });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post("/courses", adminMiddleware, async (req, res) => {
  try {
    const course = await Course.create({
      title: req.body.title,
      description: req.body.description,
      imageLink: req.body.imageLink,
      price: req.body.price,
    });
    console.log(course);
    res.json({ msg: "Course created successfully", courseId: course._id });
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get("/courses", adminMiddleware, async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json({ courses: courses });
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
