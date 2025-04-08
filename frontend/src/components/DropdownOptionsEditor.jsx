import React from 'react';
import {
  Box,
  Button,
  FormHelperText,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const DropdownOptionsEditor = ({ 
  options, 
  errors, 
  onAddOption, 
  onRemoveOption, 
  onOptionChange 
}) => {
  return (
    <Grid item xs={12}>
      <Typography variant="subtitle2" sx={{ mt: 1, mb: 2 }}>
        Dropdown Options
      </Typography>
      
      {options.map((option, optionIndex) => (
        <Box 
          key={optionIndex} 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 1,
            gap: 1 
          }}
        >
          <TextField
            label="Label"
            value={option.label}
            onChange={(e) => onOptionChange(optionIndex, 'label', e.target.value)}
            sx={{ flex: 1 }}
            size="small"
          />
          <TextField
            label="Value"
            value={option.value}
            onChange={(e) => onOptionChange(optionIndex, 'value', e.target.value)}
            sx={{ flex: 1 }}
            size="small"
          />
          <IconButton 
            color="error" 
            onClick={() => onRemoveOption(optionIndex)}
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      
      {errors && (
        <FormHelperText error>{errors}</FormHelperText>
      )}
      
      <Button 
        variant="outlined" 
        startIcon={<AddIcon />} 
        size="small"
        onClick={onAddOption}
        sx={{ mt: 1 }}
      >
        Add Option
      </Button>
    </Grid>
  );
};

export default DropdownOptionsEditor;