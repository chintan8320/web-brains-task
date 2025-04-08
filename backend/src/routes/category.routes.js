// routes/categories.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new category
router.post('/', async (req, res) => {
  const { name, expenseTypes } = req.body;
  
  try {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    
    const category = new Category({
      name,
      expenseTypes
    });
    
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update category
router.put('/:id', async (req, res) => {
  try {
    const { name, expenseTypes, status } = req.body;
    
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    
    if (name) category.name = name;
    if (expenseTypes) category.expenseTypes = expenseTypes;
    if (status) category.status = status;
    
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update category status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    
    category.status = status;
    const updatedCategory = await category.save();
    
    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;