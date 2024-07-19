const express = require("express");
const {
  createSugar,
  getSugars,
  getSugar,
  deleteSugar,
  updateSugar,
  calculateHbA1c,
} = require("../controllers/sugarController");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

//require auth for all sugar routes
router.use(requireAuth);

// Get all sugar logs
router.get("/", getSugars);

// Get a single sugar log
router.get("/:id", getSugar);

// Create a new sugar log
router.post("/", createSugar);

// Update a sugar log
router.patch("/:id", updateSugar);

// Delete a sugar log
router.delete("/:id", deleteSugar);

// Calculate and return HbA1c
router.get("/calculate/hba1c", calculateHbA1c); // Define the /hba1c route

module.exports = router;
