import { useContext, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router";
import { Box, Button } from "@mui/material";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { setCredentials } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/Activitydetail";

const ActivitiesPage = () => {
  return (
    <Box component="section" sx={{ p: 2, border: "2px dashed grey" }}>
      <ActivityForm onActivityAdded={() => window.location.reload()} />
      <ActivityList />
    </Box>
  );
};

function App() {
  const { token, tokenData, logIn, logOut, isAuthenticated } =
    useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (token) {
      // Store token and token data in localStorage for API calls
      localStorage.setItem("token", token);
      if (tokenData) {
        localStorage.setItem("tokenData", JSON.stringify(tokenData));
      }

      dispatch(setCredentials({ token, user: tokenData }));
      setAuthReady(true);
    } else {
      // Clear stored data when logged out
      localStorage.removeItem("token");
      localStorage.removeItem("tokenData");
    }
  }, [token, tokenData, dispatch]);

  return (
    <Router>
      {!token ? (
        <Button
          variant="contained"
          color="#dc4e"
          onClick={() => {
            logIn();
          }}
        >
          LOGIN
        </Button>
      ) : (
        // <div>
        //   <pre>{JSON.stringify(tokenData,null, 2)}</pre>
        // </div>
        <Box component="section" sx={{ p: 2, border: "2px dashed grey" }}>
          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>Fitness App</h2>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                logOut();
                localStorage.removeItem("token");
                localStorage.removeItem("tokenData");
              }}
            >
              Logout
            </Button>
          </Box>
          <Routes>
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />
            <Route
              path="/"
              element={
                token ? (
                  <Navigate to="/activities" replace />
                ) : (
                  <div>Welcome! Please Login</div>
                )
              }
            />
          </Routes>
        </Box>
      )}
    </Router>
  );
}

export default App;
