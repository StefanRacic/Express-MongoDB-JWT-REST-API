const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const Task = require("../models/Task");

// @route GET api/tasks
// @desc Get all users contact
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ date: -1 });
    res.json(tasks);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("SERVER ERROR");
  }
});

// @route POST api/tasks
// @desc Add new task
// @access Private
router.post(
  "/",
  [
    auth,
    [
      check("name", "Name is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, body, type, dateAdded } = req.body;

    try {
      const newTask = new Task({
        name,
        body,
        type,
        dateAdded,
        user: req.user.id
      });

      const task = await newTask.save();
      res.json(task);
    } catch (err) {
      if (err) {
        console.log(err.message);
        res.status(500).send("SERVER ERROR");
      }
    }
  }
);

// @route PUT api/tasks/:id
// @desc Update task
// @access Private
// TODO Implementation

// @route DELETE api/tasks/:id
// @desc Delete task
// @access Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(400).json({ msg: "Task Not Found" });

    // Check if user owns that task
    if (task.user.toString() !== req.user.id) {
      return res.status(400).json({ msg: "Not Authorized" });
    }

    await Task.findByIdAndRemove(req.params.id);

    res.json({ msg: "Task Removed" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("SERVER ERROR");
  }
});

module.exports = router;
