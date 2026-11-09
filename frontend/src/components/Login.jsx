import React, { useState } from "react";
import { API_BASE } from "../config";
import {
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignupClick = () => {
    navigate("/signup");
  };

  const handleLogin = async () => {
    if (!email || !username || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            _id: data.user._id,
            email: data.user.email,
            username: data.user.username,
            isAdmin: data.user.isAdmin || false,
          })
        );

        if (data.user.isAdmin) {
          const confirmAdmin = window.confirm(
            "Login successful! You are an admin. Go to Admin Dashboard?"
          );
          if (confirmAdmin) {
            onLogin(username);
            navigate("/admin");
          }
        } else {
          const confirmUser = window.confirm(
            "Login successful! Go to Home page?"
          );
          if (confirmUser) {
            onLogin(username);
            navigate("/home");
          }
        }
      } else {
        if (response.status === 404) {
          const goToSignup = window.confirm(
            data.message + " Do you want to sign up?"
          );
          if (goToSignup) {
            navigate("/signup");
          }
        } else {
          alert(data.message || "Invalid credentials");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #ffdde1, #ee9ca7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          backgroundColor: "#ffffff",
          borderRadius: 4,
          boxShadow: 6,
          p: 4,
        }}
      >
        <Typography variant="h4" align="center" fontWeight="bold" mb={3}>
          Login
        </Typography>

        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Username"
          fullWidth
          margin="normal"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, py: 1.5, fontSize: "1rem", fontWeight: "bold" }}
          onClick={handleLogin}
        >
          Login
        </Button>

        <Typography variant="body2" align="center" mt={3}>
          Don't have an account?{" "}
          <Link href="/signup" underline="hover" onClick={handleSignupClick}>
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
