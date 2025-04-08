import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Alert, Snackbar } from '@mui/material';
import CategoryForm from '../components/CategoryForm';
import CategoryList from '../components/CategoryList';
import { categoryAPI } from '../api';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editCategory, setEditCategory] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch categories';
      setError(errorMsg);
      setSnackbar({
        open: true,
        message: errorMsg,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbar({...snackbar, open: false});
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Category Management
      </Typography>
      
      {error && !snackbar.open && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 4 }}>
        <CategoryForm 
          editCategory={editCategory} 
          setEditCategory={setEditCategory} 
          fetchCategories={fetchCategories}
        />
      </Box>
      
      <CategoryList 
        categories={categories}
        loading={loading}
        fetchCategories={fetchCategories}
        setEditCategory={setEditCategory}
      />
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CategoryManagement;