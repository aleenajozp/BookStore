import React, { useState } from "react";
import { API_BASE } from "../config";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    comments: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.Name,
          email: formData.email,
          message: formData.comments,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("Message sent successfully!");
        setFormData({ Name: "", email: "", comments: "" });
      } else {
        setStatus("Failed to send: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("Something went wrong. Try again later.");
    }
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(to right, #ffdde1, #ee9ca7)",
        minHeight: "100vh",
        py: 5,
      }}
    >
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Contact Us
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          mb={2}
        >
          "Have a question, a book to share, or just want to say hello? Drop us
          a message!"
        </Typography>
      </Container>

      <Container sx={{ mb: 4 }}>
        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2} direction="column">
                  <Grid item xs={12}>
                    <TextField
                      label="Name"
                      name="Name"
                      value={formData.Name}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Comments"
                      name="comments"
                      multiline
                      rows={4}
                      value={formData.comments}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="warning"
                      fullWidth
                    >
                      SUBMIT
                    </Button>
                  </Grid>
                </Grid>
              </form>
              {status && (
                <Typography color="success.main" mt={2}>
                  {status}
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{ bgcolor: "#004d40", color: "white", p: 3, borderRadius: 1 }}
            >
              <Typography
                variant="h5"
                component="h2"
                align="center"
                gutterBottom
                sx={{
                  mb: 3,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Get in Touch
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <LocationOnIcon sx={{ fontSize: 30, mb: 1 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    ADDRESS
                  </Typography>
                  <Typography fontSize="14px">
                    Kerala Idukki Kuttikkanam
                    <br />
                    685531
                  </Typography>
                  <Typography fontSize="14px" mt={1}>
                    Our BookStore Office
                    <br />
                    Kuttikkanam 685531
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <PhoneIcon sx={{ fontSize: 30, mb: 1 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    PHONE
                  </Typography>
                  <Typography fontSize="14px">
                    For Adding Your Books
                    <br />
                    8075074556
                  </Typography>
                  <Typography fontSize="14px" mt={1}>
                    For Orders
                    <br />
                    8086265666
                  </Typography>
                  <Typography fontSize="14px" mt={1}>
                    Customer Service
                    <br />
                    8086806888
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <EmailIcon sx={{ fontSize: 30, mb: 1 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    EMAIL
                  </Typography>
                  <Typography fontSize="14px">
                    Customer Service
                    <br />
                    bookstore@gmail.com
                  </Typography>
                  <Typography fontSize="14px" mt={1}>
                    For Adding Your Books
                    <br />
                    bookstore1@gmail.com
                  </Typography>
                  <Typography fontSize="14px" mt={1}>
                    For Orders
                    <br />
                    ourbookstore@gmail.com
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
