import React from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon
} from '@mui/icons-material';
import DynamicFieldEditor from './DynamicFieldEditor';

const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'date', label: 'Date' },
  { value: 'checkbox', label: 'Checkbox' }
];

const ExpenseTypeFormDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  editMode, 
  formData, 
  errors, 
  onInputChange, 
  onDynamicFieldChange,
  onAddDynamicField,
  onRemoveDynamicField,
  onMoveFieldUp,
  onMoveFieldDown,
  onAddDropdownOption,
  onRemoveDropdownOption,
  onDropdownOptionChange
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editMode ? 'Edit Expense Type' : 'Add Expense Type'}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Expense Type Name"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            error={!!errors.name}
            helperText={errors.name}
            required
            margin="normal"
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Dynamic Fields</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add custom fields that will be collected when creating expenses of this type
          </Typography>
          
          {formData.dynamicFields.length > 0 ? (
            formData.dynamicFields.map((field, index) => (
              <DynamicFieldEditor
                key={index}
                index={index}
                field={field}
                errors={errors.dynamicFields[index] || {}}
                onFieldChange={(fieldName, value) => onDynamicFieldChange(index, fieldName, value)}
                onRemove={() => onRemoveDynamicField(index)}
                onMoveUp={() => onMoveFieldUp(index)}
                onMoveDown={() => onMoveFieldDown(index)}
                onAddDropdownOption={() => onAddDropdownOption(index)}
                onRemoveDropdownOption={(optionIndex) => onRemoveDropdownOption(index, optionIndex)}
                onDropdownOptionChange={(optionIndex, fieldName, value) => 
                  onDropdownOptionChange(index, optionIndex, fieldName, value)}
                isFirst={index === 0}
                isLast={index === formData.dynamicFields.length - 1}
              />
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 3, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography color="text.secondary">No fields added yet</Typography>
            </Box>
          )}
          
          <Button 
            variant="outlined" 
            startIcon={<AddIcon />}
            onClick={onAddDynamicField}
            fullWidth
            sx={{ mt: 2 }}
          >
            Add Field
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onSubmit}
        >
          {editMode ? 'Save Changes' : 'Create Expense Type'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpenseTypeFormDialog;