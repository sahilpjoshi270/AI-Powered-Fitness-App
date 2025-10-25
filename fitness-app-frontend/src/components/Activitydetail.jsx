import React from "react";
import { Box, Typography } from "@mui/material";

const ActivityDetail = () => {
  return (
    <Box component="section" sx={{ p: 2, border: "2px dashed grey" }}>
      <Typography variant="h4">Activity Detail</Typography>
      <Typography>
        This is where individual activity details will be displayed.
      </Typography>
    </Box>
  );
};

export default ActivityDetail;
