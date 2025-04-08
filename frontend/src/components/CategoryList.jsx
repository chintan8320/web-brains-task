import React, { useState } from 'react';
import {
  Box, Paper, Typography, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, Switch, TablePagination,
  Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle, Button,
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { categoryAPI } from '../api';

const CategoryList = ({ categories, loading, fetchCategories, setEditCategory }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState({});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = async (category) => {
    setStatusUpdateLoading({...statusUpdateLoading, [category._id]: true});
    try {
      const newStatus = category.status === 'active' ? 'inactive' : 'active';
      await categoryAPI.updateStatus(category._id, newStatus);
      fetchCategories();
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setStatusUpdateLoading({...statusUpdateLoading, [category._id]: false});
    }
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    
    setDeleteLoading(true);
    try {
      await categoryAPI.delete(categoryToDelete._id);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Categories
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 650 }} aria-label="categories table">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell>Category Name</TableCell>
              <TableCell>Expense Types</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              (rowsPerPage > 0
                ? categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : categories
              ).map((category) => (
                <TableRow key={category._id} hover>
                  <TableCell component="th" scope="row">
                    {category.name}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {category.expenseTypes.map((type) => (
                        <Chip 
                          key={type} 
                          label={type} 
                          size="small" 
                          variant="outlined" 
                          color="primary"
                        />
                      ))}
                      {category.expenseTypes.length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                          No expense types
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {statusUpdateLoading[category._id] ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Switch
                        checked={category.status === 'active'}
                        onChange={() => handleStatusChange(category)}
                        color="primary"
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color="primary" 
                      onClick={() => setEditCategory(category)}
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteClick(category)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={categories.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the category "{categoryToDelete?.name}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleteLoading}
            startIcon={deleteLoading && <CircularProgress size={20} />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CategoryList;