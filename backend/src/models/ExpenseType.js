const mongoose = require('mongoose');

const dropdownOptionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
});

const dynamicFieldSchema = new mongoose.Schema({
  label: { type: String, required: true },
  fieldName: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['text', 'number', 'dropdown', 'date', 'checkbox'],
    default: 'text'
  },
  isRequired: { type: Boolean, default: false },
  displayOrder: { type: Number, required: true },
  min: { type: String },
  max: { type: String },
  validation: { type: String },
  options: [dropdownOptionSchema]
});

const expenseTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  dynamicFields: [dynamicFieldSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

expenseTypeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ExpenseType', expenseTypeSchema);