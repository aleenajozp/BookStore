import {
  Button, TextField, IconButton,
  InputAdornment, Box, Typography, Link
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(''); // 🔹 New username state
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const handleRegister = async () => {
    if (!email || !username || !password || !rePassword) {
      alert('Please fill all fields.');
      return;
    }

    if (password !== rePassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          username, // 🔹 Include username in request
          password,
          confirmPassword: rePassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate('/login');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Detailed error:', error);
      alert(error.message);
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div>
      <div className="box">
        <h2><u>Signup</u></h2>

        <TextField 
          label="Email"
          variant="outlined"
          margin="normal"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />

        <TextField
          label="Username" // 🔹 New username input
          variant="outlined"
          margin="normal"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br />

        <Box>
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            sx={{ width: '300px' }}
            InputProps={{
              endAdornment: password && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((show) => !show)} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Re-enter Password"
            type={showRePassword ? 'text' : 'password'}
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            margin="normal"
            sx={{ width: '300px' }}
            InputProps={{
              endAdornment: rePassword && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowRePassword((show) => !show)} edge="end">
                    {showRePassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <br /><br />
        <Button variant="contained" color="warning" onClick={handleRegister}>
          Sign Up
        </Button><br /><br />

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Link href="/login" underline="hover" onClick={handleLoginClick}>
            Login
          </Link>
        </Typography>
      </div>
    </div>
  );
};

export default Signup;
