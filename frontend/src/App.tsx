import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import BookList from './components/BookList';
import UserPurchases from './components/UserPurchases';
import { useAuth } from './context/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3498db',
    },
    secondary: {
      main: '#2c3e50',
    },
    error: {
      main: '#e74c3c',
    },
  },
});

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<BookList />} />
          {isAuthenticated && (
            <Route path="/purchases" element={<UserPurchases />} />
          )}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
