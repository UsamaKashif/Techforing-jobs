import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./screens/Login";
import { theme } from "./theme";
import Register from "./screens/Register";
import PrivateRoute from "./components/PrivateRoute";
import JobList from "./screens/JobList";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/NavBar";
import CreateJob from "./screens/CreateJob";
import EditJob from "./screens/EditJob";
import HomeScreen from "./screens/Home";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/jobs"
              element={
                <PrivateRoute>
                  <JobList />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobs/create"
              element={
                <PrivateRoute>
                  <CreateJob />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobs/edit/:jobId"
              element={
                <PrivateRoute>
                  <EditJob />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
