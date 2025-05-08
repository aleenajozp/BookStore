import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Home, ShoppingCart, AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "@fontsource/playfair-display";
import "@fontsource/montserrat";

const NavBar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      style={{
        background: "linear-gradient(145deg, #2c3e50, #4a6491)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(8px)",
        zIndex: 10,
        width: "100%",
        top: 0,
      }}
    >
      <Toolbar
        style={{
          justifyContent: "space-between",
          gap: "1rem",
          padding: "0 2rem",
        }}
      >
        <Typography
          variant="h4"
          component="a"
          href="/slider"
          style={{
            textDecoration: "none",
            color: "#f5f5f5",
            fontWeight: "700",
            fontFamily: '"Playfair Display", serif',
            letterSpacing: "1.5px",
            minWidth: "180px",
            transition: "all 0.3s ease",
            textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
          }}
          onMouseEnter={(e) => {
            e.target.style.textShadow = "0 0 12px rgba(255, 215, 0, 0.7)";
            e.target.style.color = "#ffd700";
          }}
          onMouseLeave={(e) => {
            e.target.style.textShadow = "1px 1px 3px rgba(0,0,0,0.3)";
            e.target.style.color = "#f5f5f5";
          }}
        >
          My BookStore
        </Typography>

        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Button
            color="inherit"
            onClick={() => navigate("/slider")}
            startIcon={<Home />}
            sx={{
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: 500,
              letterSpacing: "0.5px",
              "&:hover": {
                backgroundColor: "rgba(255, 215, 0, 0.2)",
              },
            }}
          >
            Home
          </Button>

          <Button
            color="inherit"
            onClick={() => navigate("/contactus")}
            sx={{
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: 500,
              letterSpacing: "0.5px",
              "&:hover": {
                backgroundColor: "rgba(255, 215, 0, 0.2)",
              },
            }}
          >
            Contact Us
          </Button>

          <Button
            color="inherit"
            onClick={() => navigate("/aboutus")}
            sx={{
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: 500,
              letterSpacing: "0.5px",
              "&:hover": {
                backgroundColor: "rgba(255, 215, 0, 0.2)",
              },
            }}
          >
            About Us
          </Button>

          {user && (
            <>
              <Button
                color="inherit"
                onClick={() => navigate("/cart")}
                startIcon={<ShoppingCart />}
                sx={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                  "&:hover": {
                    backgroundColor: "rgba(255, 215, 0, 0.2)",
                  },
                }}
              >
                Cart
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate("/orders")}
                sx={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                  "&:hover": {
                    backgroundColor: "rgba(255, 215, 0, 0.2)",
                  },
                }}
              >
                Orders
              </Button>

              <Button
                color="inherit"
                onClick={onLogout}
                startIcon={<AccountCircle />}
                sx={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                  "&:hover": {
                    backgroundColor: "rgba(255, 215, 0, 0.2)",
                  },
                }}
              >
                Logout
              </Button>
            </>
          )}

          {!user && (
            <Button
              color="inherit"
              onClick={() => navigate("/login")}
              startIcon={<AccountCircle />}
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 500,
                letterSpacing: "0.5px",
                "&:hover": {
                  backgroundColor: "rgba(255, 215, 0, 0.2)",
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
