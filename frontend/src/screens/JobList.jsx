import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  Chip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
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

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    jobType: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, filters]);

  const fetchJobs = async () => {
    try {
      const response = await api.get("/jobs");
      console.log(response.data);
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  };

  const applyFilters = () => {
    const filtered = jobs.filter((job) => {
      return (
        (filters.category ? job.category === filters.category : true) &&
        (filters.jobType ? job.job_type === filters.jobType : true)
      );
    });
    setFilteredJobs(filtered);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", marginTop: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            label="Category"
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Job Type</InputLabel>
          <Select
            name="jobType"
            value={filters.jobType}
            onChange={handleFilterChange}
            label="Job Type"
          >
            <MenuItem value="">All</MenuItem>
            {jobTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {filteredJobs.length === 0 ? (
        <Typography variant="h6" align="center" color="textSecondary">
          No jobs available.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredJobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Card
                sx={{
                  display: "flex",
                  height: "100%",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: 3,
                  borderRadius: 2,
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {job.title}
                  </Typography>
                  <Typography color="textSecondary" sx={{ mb: 1 }}>
                    {job.company}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                    }}
                  >
                    {job.description}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip label={job.category} color="primary" sx={{ mb: 1 }} />
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Job Type:</strong> {job.job_type}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Location:</strong> {job.location}
                  </Typography>
                </CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    p: 1,
                    backgroundColor: "#f9f9f9",
                    borderBottomRightRadius: "10px",
                    borderBottomLeftRadius: "10px",
                  }}
                >
                  <IconButton
                    onClick={() => navigate(`/jobs/edit/${job.id}`)}
                    sx={{ color: "primary.main" }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(job.id)}
                    sx={{ color: "error.main" }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default JobList;
