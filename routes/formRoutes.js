const express = require("express");
const router = express.Router();
const Form = require("../models/CreatedForm");
const FormResponse = require("../models/FormResponse");

// POST - Save form
router.post("/", async (req, res) => {
  try {
    const form = new Form(req.body);
    const saved = await form.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET - Fetch all forms
router.get("/", async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get form by ID
router.get("/:id", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }
    res.json(form);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedForm = await Form.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedForm) {
      return res.status(404).json({ error: "Form not found" });
    }
    res.json(updatedForm);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedForm = await Form.findByIdAndDelete(id);

    if (!deletedForm) {
      return res.status(404).json({ message: "Form not found." });
    }

    res.status(200).json({ message: "Form deleted successfully." });
  } catch (error) {
    console.error("Error deleting form:", error);
    res.status(500).json({ message: "Server error while deleting form." });
  }
});

router.post("/responses", async (req, res) => {
  try {
    const response = new FormResponse(req.body);
    const saved = await response.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/responses", async (req, res) => {
  try {
    const responses = await FormResponse.find().sort({ submittedAt: -1 });
    res.json(responses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/responses/:id", async (req, res) => {
  try {
    const response = await FormResponse.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ error: "Form response not found" });
    }
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;
