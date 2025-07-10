// src/features/website/pages/guest/NotFoundPage.jsx
import React from "react";
import { Box, Typography, Container } from "@mui/material"; 
import notFoundImage from "@assets/images/monkey.png"; 

const NotFoundPage = () => {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        padding: 2,
      }}
    >
      <Box
        component="img"
        src={notFoundImage}
        alt="Page Not Found"
        sx={{
          maxWidth: "100%",
          width: "200px", 
          mb: 3, 
        }}
      />
      <Typography variant="h5" color="text.primary" gutterBottom>
        Trang này không có sẵn. Mong bạn thông cảm.
      </Typography>
    </Container>
  );
};

export default NotFoundPage;