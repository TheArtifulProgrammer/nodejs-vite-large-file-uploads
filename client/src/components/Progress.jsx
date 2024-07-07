import PropTypes from "prop-types";
import { LinearProgress, Box, Typography } from "@mui/material";

const Progress = ({ value }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" value={value} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          value
        )}%`}</Typography>
      </Box>
    </Box>
  );
};

Progress.propTypes = {
  value: PropTypes.number.isRequired,
};

export default Progress;
