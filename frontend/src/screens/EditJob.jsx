// EditJob.js
import React, { useEffect, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
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

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    job_type: "",
    description: "",
    salary: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch job details when component mounts
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${jobId}`);
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job:", error);
        alert("Failed to load job details.");
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.put(`/jobs/${jobId}`, formData);
      alert("Job successfully updated!");
      navigate("/jobs");
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Failed to update job.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
          Edit Job Posting
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
              name="job_type"
              value={formData.job_type}
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
            disabled={updating}
          >
            {updating ? "Updating..." : "Update Job"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default EditJob;
