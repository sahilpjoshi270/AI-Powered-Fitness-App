import React, { useState } from "react";
import { addActivity } from "../services/Api";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";

const ActivityForm = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({
    type: "RUNNING",
    duration: "",
    caloriesBurned: "",
    additionalMetrics: {},
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending activity data:", activity);
      const response = await addActivity(activity);
      console.log("Success response:", response);
      onActivityAdded();
      setActivity({ type: "RUNNING", duration: "", caloriesBurned: "" });
    } catch (error) {
      console.error("Error adding activity:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="activity-type-label">Activity Type</InputLabel>
        <Select
          labelId="activity-type-label"
          value={activity.type}
          label="Activity Type"
          onChange={(e) => setActivity({ ...activity, type: e.target.value })}
        >
          <MenuItem value="WALKING">Walking</MenuItem>
          <MenuItem value="RUNNING">Running</MenuItem>
          <MenuItem value="CYCLING">Cycling</MenuItem>
          <MenuItem value="SWIMMING">Swimming</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Duration (minutes)"
        type="number"
        value={activity.duration}
        onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Calories Burned"
        type="number"
        value={activity.caloriesBurned}
        onChange={(e) =>
          setActivity({ ...activity, caloriesBurned: e.target.value })
        }
        sx={{ mb: 2 }}
      />

      <Button type="submit" variant="contained" color="primary">
        Add Activity
      </Button>
    </Box>
  );
};

export default ActivityForm;
