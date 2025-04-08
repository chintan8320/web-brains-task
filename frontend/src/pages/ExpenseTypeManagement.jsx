import React, { useState, useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { expenseTypeAPI } from '../api';
import ExpenseTypeList from '../components/ExpenseTypeList';
import ExpenseTypeFormDialog from '../components/ExpenseTypeFormDialog';

const ExpenseTypeManagement = () => {
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentExpenseTypeId, setCurrentExpenseTypeId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    dynamicFields: []
  });
  
  const [errors, setErrors] = useState({
    name: '',
    dynamicFields: []
  });

  useEffect(() => {
    fetchExpenseTypes();
  }, []);

  const fetchExpenseTypes = async () => {
    try {
      const response = await expenseTypeAPI.getAll();
      setExpenseTypes(response.data);
    } catch (error) {
      console.error('Error fetching expense types:', error);
    }
  };

  const handleOpenDialog = (expenseType = null) => {
    if (expenseType) {
      setFormData({
        name: expenseType.name,
        dynamicFields: [...expenseType.dynamicFields]
      });
      setCurrentExpenseTypeId(expenseType._id);
      setEditMode(true);
    } else {
      setFormData({
        name: '',
        dynamicFields: []
      });
      setCurrentExpenseTypeId(null);
      setEditMode(false);
    }
    setErrors({ name: '', dynamicFields: [] });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleDynamicFieldChange = (index, field, value) => {
    const updatedFields = [...formData.dynamicFields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    setFormData({ ...formData, dynamicFields: updatedFields });
    
    const updatedErrors = [...errors.dynamicFields];
    if (updatedErrors[index]) {
      updatedErrors[index] = { ...updatedErrors[index], [field]: '' };
      setErrors({ ...errors, dynamicFields: updatedErrors });
    }
  };

  const addDynamicField = () => {
    setFormData({
      ...formData,
      dynamicFields: [
        ...formData.dynamicFields,
        {
          label: '',
          fieldName: '',
          type: 'text',
          isRequired: false,
          displayOrder: formData.dynamicFields.length + 1,
          min: '',
          max: '',
          validation: '',
          options: []
        }
      ]
    });
    
    setErrors({
      ...errors,
      dynamicFields: [...errors.dynamicFields, {}]
    });
  };

  const removeDynamicField = (index) => {
    const updatedFields = [...formData.dynamicFields];
    updatedFields.splice(index, 1);
    
    updatedFields.forEach((field, idx) => {
      field.displayOrder = idx + 1;
    });
    
    setFormData({ ...formData, dynamicFields: updatedFields });
    
    const updatedErrors = [...errors.dynamicFields];
    updatedErrors.splice(index, 1);
    setErrors({ ...errors, dynamicFields: updatedErrors });
  };

  const moveFieldUp = (index) => {
    if (index === 0) return;
    
    const updatedFields = [...formData.dynamicFields];
    const temp = updatedFields[index];
    updatedFields[index] = updatedFields[index - 1];
    updatedFields[index - 1] = temp;
    
    updatedFields.forEach((field, idx) => {
      field.displayOrder = idx + 1;
    });
    
    setFormData({ ...formData, dynamicFields: updatedFields });
  };

  const moveFieldDown = (index) => {
    if (index === formData.dynamicFields.length - 1) return;
    
    const updatedFields = [...formData.dynamicFields];
    const temp = updatedFields[index];
    updatedFields[index] = updatedFields[index + 1];
    updatedFields[index + 1] = temp;
    
    updatedFields.forEach((field, idx) => {
      field.displayOrder = idx + 1;
    });
    
    setFormData({ ...formData, dynamicFields: updatedFields });
  };

  const addDropdownOption = (fieldIndex) => {
    const updatedFields = [...formData.dynamicFields];
    if (!updatedFields[fieldIndex].options) {
      updatedFields[fieldIndex].options = [];
    }
    updatedFields[fieldIndex].options.push({ label: '', value: '' });
    setFormData({ ...formData, dynamicFields: updatedFields });
  };

  const removeDropdownOption = (fieldIndex, optionIndex) => {
    const updatedFields = [...formData.dynamicFields];
    updatedFields[fieldIndex].options.splice(optionIndex, 1);
    setFormData({ ...formData, dynamicFields: updatedFields });
  };

  const handleDropdownOptionChange = (fieldIndex, optionIndex, field, value) => {
    const updatedFields = [...formData.dynamicFields];
    updatedFields[fieldIndex].options[optionIndex][field] = value;
    setFormData({ ...formData, dynamicFields: updatedFields });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', dynamicFields: [] };

    if (!formData.name.trim()) {
      newErrors.name = 'Expense Type Name is required';
      valid = false;
    }

    formData.dynamicFields.forEach((field, index) => {
      newErrors.dynamicFields[index] = {};
      
      if (!field.label.trim()) {
        newErrors.dynamicFields[index].label = 'Label is required';
        valid = false;
      }
      
      if (!field.fieldName.trim()) {
        newErrors.dynamicFields[index].fieldName = 'Field Name is required';
        valid = false;
      } else if (!/^[a-zA-Z0-9_]+$/.test(field.fieldName)) {
        newErrors.dynamicFields[index].fieldName = 'Field Name can only contain letters, numbers, and underscores';
        valid = false;
      }
      
      if (field.type === 'number') {
        if (field.min !== '' && field.max !== '' && Number(field.min) > Number(field.max)) {
          newErrors.dynamicFields[index].min = 'Min value cannot be greater than Max value';
          valid = false;
        }
      }
      
      if (field.validation && field.validation.trim() !== '') {
        try {
          new RegExp(field.validation);
        } catch (e) {
          newErrors.dynamicFields[index].validation = 'Invalid regular expression';
          valid = false;
        }
      }
      
      if (field.type === 'dropdown' && (!field.options || field.options.length === 0)) {
        newErrors.dynamicFields[index].options = 'Dropdown must have at least one option';
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editMode) {
        await expenseTypeAPI.update(currentExpenseTypeId, formData);
      } else {
        await expenseTypeAPI.create(formData);
      }
      handleCloseDialog();
      fetchExpenseTypes();
    } catch (error) {
      console.error('Error submitting expense type:', error);
    }
  };

  const handleDeleteExpenseType = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense type?')) {
      try {
        await expenseTypeAPI.delete(id);
        fetchExpenseTypes();
      } catch (error) {
        console.error('Error deleting expense type:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Expense Type Management
        </Typography>
        
        <ExpenseTypeList
          expenseTypes={expenseTypes}
          onAddClick={() => handleOpenDialog()}
          onEditClick={handleOpenDialog}
          onDeleteClick={handleDeleteExpenseType}
        />
        
        <ExpenseTypeFormDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onSubmit={handleSubmit}
          editMode={editMode}
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
          onDynamicFieldChange={handleDynamicFieldChange}
          onAddDynamicField={addDynamicField}
          onRemoveDynamicField={removeDynamicField}
          onMoveFieldUp={moveFieldUp}
          onMoveFieldDown={moveFieldDown}
          onAddDropdownOption={addDropdownOption}
          onRemoveDropdownOption={removeDropdownOption}
          onDropdownOptionChange={handleDropdownOptionChange}
        />
      </Box>
    </Container>
  );
};

export default ExpenseTypeManagement;