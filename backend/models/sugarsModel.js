const mongoose = require("mongoose");

// function to create schema
const Schema = mongoose.Schema;

const sugarSchema = new Schema(
  {
    sugarlvl: { type: Number, required: true },
    time: { type: Date, default: Date.now },
    meal: { type: String, required: true },
    notes: { type: String },
    user_id: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sugar", sugarSchema);
