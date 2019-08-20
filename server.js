const express = require("express");
const connectDB = require("./config/db");

// Initalize app
const app = express();

// Connect MongoDB
connectDB();

// Init middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.json({ msg: "First GET Method for TaskKeeper API" });
});

// Defining Routes
app.use("/api/users", require("./routes/users"));
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/tasks", require("./routes/tasks"));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
