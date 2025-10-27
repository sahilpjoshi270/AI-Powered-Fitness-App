import React from "react";
import { Box, Typography } from "@mui/material";

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        const response = await getActivityDetail(id);
        setActivity(response.data);
        setRecommendation(response.data.recommendation);
      } catch (error) {
        console.error("Error fetching activity detail:", error);
      }
    };
    fetchActivityDetail();
  }, [id]);
  if (!activity) {
    return <Typography>Loading...</Typography>;
  }
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
