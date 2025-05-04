import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, InputBase, Paper } from '@mui/material';
import { Home, ShoppingCart, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement your search logic here
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#ff80ab', background: 'linear-gradient(135deg, #ff80ab 0%, #ff4081 100%)' }}>
      <Toolbar sx={{ justifyContent: 'space-between', gap: 1 }}>
        {/* Left side - Logo */}
        <Typography variant="h6" component="a" href="/slider" sx={{ textDecoration: 'none', color: 'white', fontWeight: 'bold', minWidth: '150px', '&:hover': { textShadow: '0 0 8px rgba(255,255,255,0.5)' } }}>
          My BookStore
        </Typography>

        {/* Search Box */}
        <Paper
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: '200px',
            backgroundColor: 'white',
            borderRadius: '20px',
            transition: 'width 0.3s',
            '&:hover': {
              width: '250px',
              boxShadow: '0 0 0 2px rgba(255,64,129,0.3)',
            },
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1, fontSize: '0.9rem' }}
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IconButton
            type="submit"
            size="small"
            sx={{ p: '5px', color: '#ff4081' }}
          >
            <Search fontSize="small" />
          </IconButton>
        </Paper>

        {/* Right side - Navigation buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Always visible: Home, Contact Us, About Us */}
          <Button color="inherit" onClick={() => navigate('/slider')}>
            <Home />
          </Button>
          <Button color="inherit" onClick={() => navigate('/contactus')}>Contact Us</Button>
          <Button color="inherit" onClick={() => navigate('/aboutus')}>About Us</Button>

          {/* Only when logged in: Cart + Logout */}
          {user && (
            <>
              <Button color="inherit" onClick={() => navigate('/cart')}>
                <ShoppingCart />
              </Button>
              <Button color="inherit" onClick={onLogout}>Logout</Button>
            </>
          )}

          {/* Only when logged out: Login */}
          {!user && (
            <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;