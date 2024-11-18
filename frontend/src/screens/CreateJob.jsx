// CreateJob.js
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const categories = [
  "Sales & Marketing",
  "Creative",
  "Human Resource",
  "Administration",
  "Digital Marketing",
  "Development",
  "Engineering",
];

const jobTypes = ["Full-time", "Part-time", "Freelance", "Internship"];

const CreateJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    type: "",
    description: "",
    salary: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/jobs", formData);
      console.log("Job Created:", response.data);
      alert("Job successfully created!");
      navigate("/jobs");
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Failed to create job.");
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 5,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Create Job Posting
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Job Title"
            variant="outlined"
            fullWidth
            margin="normal"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Location"
            variant="outlined"
            fullWidth
            margin="normal"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Job Type</InputLabel>
            <Select
              label="Job Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              {jobTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Job Description"
            variant="outlined"
            fullWidth
            margin="normal"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />

          <TextField
            label="Salary"
            variant="outlined"
            fullWidth
            margin="normal"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            required
            type="number"
            InputProps={{ startAdornment: "PKR " }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Create Job
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default CreateJob;
