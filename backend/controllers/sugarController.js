const Sugar = require("../models/sugarsModel");
const mongoose = require("mongoose");

// Get all sugar logs
const getSugars = async (req, res) => {
  const user_id = req.user._id;
  let query = { user_id };
  const { timeframe } = req.query;

  if (timeframe === "week") {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    query.time = { $gte: oneWeekAgo };
  } else if (timeframe === "month") {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    query.time = { $gte: oneMonthAgo };
  } // Existing getSugars function modifications for timeframe handling
  else if (timeframe === "3months") {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    query.time = { $gte: threeMonthsAgo };
  }

  const sugars = await Sugar.find(query).sort({ time: -1 });
  res.status(200).json(sugars);
};

// Get a single sugar log
const getSugar = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: `No sugar log with id: ${id}` });
  }

  const sugar = await Sugar.findById({ _id: id });

  if (!sugar) {
    return res.status(404).json({ message: `No sugar log with id: ${id}` });
  }

  res.status(200).json(sugar);
};

// Create a new sugar log
const createSugar = async (req, res) => {
  const { sugarlvl, meal, notes } = req.body;

  let emptyFields = [];

  if (!sugarlvl) {
    emptyFields.push("sugarlvl");
  }
  if (!meal) {
    emptyFields.push("meal");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in the required fields", emptyFields });
  }

  // add log to database
  try {
    const newSugar = await Sugar.create({
      sugarlvl,
      meal,
      notes,
      user_id: req.user._id,
    });

    res.status(201).json(newSugar);
  } catch (err) {
    res.status(400).json({ message: "Something went wrong \n" + err.message });
    console.log(err);
  }
};

// Update a sugar log
const updateSugar = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: `No sugar log with id: ${id}` });
  }

  const sugar = await Sugar.findOneAndUpdate({ _id: id }, { ...req.body });

  if (!sugar) {
    return res.status(404).json({ message: `No sugar log with id: ${id}` });
  }

  res.status(200).json(sugar);
};

// Delete a sugar log
const deleteSugar = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: `No sugar log with id: ${id}` });
  }

  const sugar = await Sugar.findOneAndDelete({ _id: id });

  if (!sugar) {
    return res.status(404).json({ message: `No sugar log with id: ${id}` });
  }

  res.status(200).json(sugar);
};

// calculate A1c
const calculateHbA1c = async (req, res) => {
  const user_id = req.user._id;
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const sugars = await Sugar.find({
    user_id,
    time: { $gte: threeMonthsAgo },
  });

  const averageSugar =
    sugars.reduce((acc, curr) => acc + curr.sugarlvl, 0) / sugars.length;

  const hba1c = (averageSugar + 46.7) / 28.7;

  res.status(200).json({ hba1c: hba1c.toFixed(2) });
};

module.exports = {
  getSugars,
  getSugar,
  createSugar,
  deleteSugar,
  updateSugar,
  calculateHbA1c,
};
