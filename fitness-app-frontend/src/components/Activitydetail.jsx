import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import { getActivityDetail } from "../services/Api";

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityDetail = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        console.log("Fetching activity detail for ID:", id);
        const response = await getActivityDetail(id);
        console.log("Response received:", response.data);
        setActivity(response.data);
      } catch (error) {
        console.error("Error fetching activity detail:", error);
        setError(error.message || "Failed to load activity details");
      } finally {
        setLoading(false);
      }
    };
    fetchActivityDetail();
  }, [id]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (!activity) {
    return <Typography>No activity found</Typography>;
  }
  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5">Activity Detail</Typography>
          <Typography>Type: {activity.type}</Typography>
          <Typography> Duration: {activity.duration} minutes</Typography>
          <Typography> Calories: {activity.caloriesBurned}</Typography>
          <Typography>
            Date: {new Date(activity.createdAt).toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
      {activity.recommendation && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              AI Recommendation
            </Typography>
            <Typography variant="h6">Analysis</Typography>
            <Typography paragraph>{activity.recommendation}</Typography>
            <Divider sx={{ my: 2 }}></Divider>
            <Typography variant="h6">Improvements</Typography>
            {activity?.improvements?.map((improvement, index) => (
              <Typography key={index} paragraph>
                {improvement}
              </Typography>
            ))}
            <Divider sx={{ my: 2 }}></Divider>
            <Typography variant="h6">Suggestions</Typography>
            {activity?.suggestions?.map((suggestion, index) => (
              <Typography key={index} paragraph>
                {suggestion}
              </Typography>
            ))}
            <Divider sx={{ my: 2 }}></Divider>
            <Typography variant="h6">Safety Guidelines</Typography>
            {activity?.safety?.map((safety, index) => (
              <Typography key={index} paragraph>
                {safety}
              </Typography>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ActivityDetail;
