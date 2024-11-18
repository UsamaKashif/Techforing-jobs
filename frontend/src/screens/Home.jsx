import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  CircularProgress,
  Container,
  Divider,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { api } from "../services/api";

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedJobs, setGroupedJobs] = useState({});

  // Fetch job categories from the backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/alljobs");
        const jobsData = response.data;

        // Group jobs by category
        const jobsByCategory = jobsData.reduce((acc, job) => {
          if (!acc[job.category]) {
            acc[job.category] = [];
          }
          acc[job.category].push(job);
          return acc;
        }, {});

        setGroupedJobs(jobsByCategory);
      } catch (err) {
        console.error("Failed to fetch job categories", err);
        setError("Failed to fetch job categories");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", marginTop: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Browse Open Positions by Category
      </Typography>
      <Typography align="center" sx={{ marginBottom: 3 }}>
        We are always on the lookout for talented people
      </Typography>

      {Object.keys(groupedJobs).map((category, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{category}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {groupedJobs[category].length > 0 ? (
              groupedJobs[category].map((job, jobIndex) => (
                <Box key={job.id} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {job.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Type: {job.job_type}
                  </Typography>

                  {/* Limited Description */}
                  <Typography
                    variant="body1"
                    sx={{
                      mt: 1,
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                    }}
                  >
                    {job.description}
                  </Typography>

                  {/* Divider between jobs */}
                  {jobIndex !== groupedJobs[category].length - 1 && (
                    <Divider sx={{ my: 2 }} />
                  )}
                </Box>
              ))
            ) : (
              <Typography>No jobs available in this category</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

export default HomeScreen;
