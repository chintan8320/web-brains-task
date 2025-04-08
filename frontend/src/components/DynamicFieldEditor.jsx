import React from 'react';
import {
  Box,
  Card,
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
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon
} from '@mui/icons-material';
import { fieldTypesList } from '../constants/constants';

const DynamicFieldEditor = ({ 
  index, 
  field, 
  errors, 
  onFieldChange, 
  onRemove, 
  onMoveUp, 
  onMoveDown,
  onAddDropdownOption,
  onRemoveDropdownOption,
  onDropdownOptionChange,
  isFirst,
  isLast
}) => {
  return (
    <Card sx={{ mb: 3, p: 2, position: 'relative' }}>
      <Box sx={{ position: 'absolute', right: 8, top: 8, display: 'flex' }}>
        <Tooltip title="Move Up">
          <span>
            <IconButton 
              size="small" 
              disabled={isFirst}
              onClick={onMoveUp}
            >
              <ArrowUpIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Move Down">
          <span>
            <IconButton 
              size="small" 
              disabled={isLast}
              onClick={onMoveDown}
            >
              <ArrowDownIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Remove Field">
          <IconButton 
            size="small" 
            color="error"
            onClick={onRemove}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Field #{index + 1}
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Label"
            value={field.label}
            onChange={(e) => onFieldChange('label', e.target.value)}
            required
            error={!!errors.label}
            helperText={errors.label}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Field Name"
            value={field.fieldName}
            onChange={(e) => onFieldChange('fieldName', e.target.value)}
            required
            error={!!errors.fieldName}
            helperText={errors.fieldName || 'Use snake_case or camelCase'}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Field Type</InputLabel>
            <Select
              value={field.type}
              label="Field Type"
              onChange={(e) => onFieldChange('type', e.target.value)}
            >
              {fieldTypesList.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={field.isRequired}
                  onChange={(e) => onFieldChange('isRequired', e.target.checked)}
                />
              }
              label="Required Field"
            />
          </Box>
        </Grid>
        
        {field.type === 'number' && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Minimum Value"
                value={field.min}
                onChange={(e) => onFieldChange('min', e.target.value)}
                error={!!errors.min}
                helperText={errors.min}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Maximum Value"
                value={field.max}
                onChange={(e) => onFieldChange('max', e.target.value)}
                error={!!errors.max}
                helperText={errors.max}
              />
            </Grid>
          </>
        )}
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Validation Regex (optional)"
            value={field.validation || ''}
            onChange={(e) => onFieldChange('validation', e.target.value)}
            error={!!errors.validation}
            helperText={errors.validation || 'Regular expression pattern for validation'}
          />
        </Grid>
        
        {field.type === 'dropdown' && (
          <DropdownOptionsEditor
            options={field.options || []}
            errors={errors.options}
            onAddOption={onAddDropdownOption}
            onRemoveOption={onRemoveDropdownOption}
            onOptionChange={onDropdownOptionChange}
          />
        )}
      </Grid>
    </Card>
  );
};

export default DynamicFieldEditor;