import React, { useState, useEffect } from 'react';
import { 
  Box, Button, TextField, Typography, Paper, 
  Chip, OutlinedInput, MenuItem, FormControl,
  InputLabel, Select, CircularProgress
} from '@mui/material';
import { categoryAPI, expenseTypeAPI } from '../api';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CategoryForm = ({ editCategory, setEditCategory, fetchCategories }) => {
  const [name, setName] = useState('');
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [expenseTypeList, setExpenseTypesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExpenseTypes()
  }, [])
  
  useEffect(() => {
    if (editCategory) {
      setName(editCategory.name || '');
      setExpenseTypes(editCategory.expenseTypes || []);
    } else {
      setName('');
      setExpenseTypes([]);
    }
  }, [editCategory]);

  const fetchExpenseTypes = async () => {
      try {
        const response = await expenseTypeAPI.getAll();
        console.log(response.data, "opopop")
        setExpenseTypesList(response.data.map((ite) => ite.name));
      } catch (error) {
        console.error('Error fetching expense types:', error);
      }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const categoryData = {
      name,
      expenseTypes
    };
    
    try {
      if (editCategory) {
        await categoryAPI.update(editCategory._id, categoryData);
      } else {
        await categoryAPI.create(categoryData);
      }
      
      setName('');
      setExpenseTypes([]);
      setEditCategory(null);
      fetchCategories();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'An error occurred';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    setName('');
    setExpenseTypes([]);
    setEditCategory(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        {editCategory ? 'Edit Category' : 'Add New Category'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
          error={!!error && error.includes('name')}
          helperText={error && error.includes('name') ? error : ''}
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="expense-types-label">Expense Types</InputLabel>
          <Select
            labelId="expense-types-label"
            multiple
            value={expenseTypes}
            onChange={(e) => setExpenseTypes(e.target.value)}
            input={<OutlinedInput label="Expense Types" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {expenseTypeList.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {error && !error.includes('name') && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          {editCategory && (
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {editCategory ? 'Update' : 'Add'} Category
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CategoryForm;