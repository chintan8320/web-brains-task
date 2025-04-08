import React from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const ExpenseTypeList = ({ expenseTypes, onAddClick, onEditClick, onDeleteClick }) => {
  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={onAddClick}
        >
          Add Expense Type
        </Button>
      </Box>
      
      {expenseTypes.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Expense Type Name</TableCell>
                <TableCell>Number of Fields</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenseTypes.map((expenseType) => (
                <TableRow key={expenseType._id}>
                  <TableCell>{expenseType.name}</TableCell>
                  <TableCell>{expenseType.dynamicFields.length}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => onEditClick(expenseType)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => onDeleteClick(expenseType._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1">No expense types found. Add one to get started!</Typography>
        </Box>
      )}
    </>
  );
};

export default ExpenseTypeList;