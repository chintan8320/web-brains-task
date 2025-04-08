const express = require('express');
const router = express.Router();
const ExpenseType = require('../models/ExpenseType');

// Get all expense types
router.get('/', async (req, res) => {
  try {
    const expenseTypes = await ExpenseType.find().sort({ name: 1 });
    res.json(expenseTypes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific expense type
router.get('/:id', async (req, res) => {
  try {
    const expenseType = await ExpenseType.findById(req.params.id);
    if (!expenseType) {
      return res.status(404).json({ message: 'Expense type not found' });
    }
    res.json(expenseType);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new expense type
router.post('/', async (req, res) => {
  try {
    // Validate request
    if (!req.body.name) {
      return res.status(400).json({ message: 'Expense type name is required' });
    }

    // Create a new expense type
    const expenseType = new ExpenseType({
      name: req.body.name,
      dynamicFields: req.body.dynamicFields || []
    });

    // Save to database
    const newExpenseType = await expenseType.save();
    res.status(201).json(newExpenseType);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an expense type
router.put('/:id', async (req, res) => {
  try {
    // Find and update the expense type
    const updatedExpenseType = await ExpenseType.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        dynamicFields: req.body.dynamicFields,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!updatedExpenseType) {
      return res.status(404).json({ message: 'Expense type not found' });
    }

    res.json(updatedExpenseType);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an expense type
router.delete('/:id', async (req, res) => {
  try {
    const expenseType = await ExpenseType.findByIdAndDelete(req.params.id);
    
    if (!expenseType) {
      return res.status(404).json({ message: 'Expense type not found' });
    }
    
    res.json({ message: 'Expense type deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;