// src/App.js
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import CategoryManagement from './pages/CategoryManagement';
import ExpenseTypeManagement from './pages/ExpenseTypeManagement';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/categories" />} />
          <Route path="/categories" element={<CategoryManagement />} />
          <Route path="/expense-types" element={<ExpenseTypeManagement />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
