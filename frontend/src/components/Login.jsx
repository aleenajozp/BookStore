import React, { useState } from 'react';
import {
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  Link
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleLogin = async () => {
    // Check if fields are filled
    if (!email || !username || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Store user data in localStorage (useful for later checks, like in Home.js)
        localStorage.setItem('user', JSON.stringify({
          email: data.user.email,
          username: data.user.username,
          isAdmin: data.user.isAdmin || false
        }));

        // Check if user is admin
        if (data.user.isAdmin) {
          const userConfirmed = window.confirm('Login successful! You are an admin. Do you want to go to the Admin Dashboard?');
          if (userConfirmed) {
            onLogin(username); // Notify parent component (App.jsx) about successful login
            navigate('/admin'); // Redirect to the admin dashboard
          }
        } else {
          const userConfirmed = window.confirm('Login successful! Do you want to go to the Home page?');
          if (userConfirmed) {
            onLogin(username); // Notify parent component (App.jsx) about successful login
            navigate('/home'); // Redirect to the home page for regular users
          }
        }
      } else {
        const data = await response.json();

        if (response.status === 404) {
          const goToSignup = window.confirm(data.message + ' Do you want to sign up?');
          if (goToSignup) {
            navigate('/signup');
          }
        } else {
          alert(data.message || 'Invalid credentials');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div>
      <div className="box">
        <h2><u>Login</u></h2>

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: password && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <br /><br />
        <Button variant="contained" color="warning" onClick={handleLogin}>
          Login
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don't have an account?{' '}
          <Link href="/signup" underline="hover" onClick={handleSignupClick}>
            Sign Up
          </Link>
        </Typography>
      </div>
    </div>
  );
};

export default Login;
