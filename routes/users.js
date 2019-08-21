// Main framework
const express = require("express");
// Router
const router = express.Router();
// Crypting password
const bcrypt = require("bcryptjs");
// JSON Web Token for authorization
const jwt = require("jsonwebtoken");
// Config
const config = require("config");
// Validation
const { check, validationResult } = require("express-validator");
// User Model
const User = require("../models/User");

// @route GET api/users
// @desc Get All Users
// @access Public
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0, _id: 0 });

    res.json(users);
  } catch (err) {
    console.log(err.msg);
    res.status(500).send("SERVER ERROR");
  }
});

// @route POST api/users
// @desc Register a new user
// @access Public
router.post(
  "/",
  [
    check("name", "Please Add Name")
      .not()
      .isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter  a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json.status({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User arleady exists" });
      }

      user = new User({
        name,
        email,
        password
      });
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      res.json({ msg: "User Added" });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
