require("dotenv").config();

const express = require("express");
const sugarRoutes = require("./routes/sugars");
const userRoutes = require("./routes/user");

const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;
const cors = require("cors");

// EXPRESS CONFIG
const app = express();
const PORT = process.env.PORT;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// MONGOOSE CONFIG
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Listening on port:`, PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//routes
app.use("/api/sugars", sugarRoutes);
app.use("/api/user", userRoutes);
