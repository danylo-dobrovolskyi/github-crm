import { Box, CircularProgress } from "@mui/material";

const Loader = () => (
  <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
    <CircularProgress />
  </Box>
);

export default Loader;
