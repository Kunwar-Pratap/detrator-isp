"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { OutlinedInput } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import axios from "@/utils/axios";
import { AxiosError } from "axios";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  background: "#334756",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
}));

export default function LoginCard() {
  const [error, setError] = React.useState("");
  const [username, setUsername] = React.useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!username) {
      setError("Please enter your username.");
      return;
    }

    try {
      const res = await axios.post("/login", { username });
      if (typeof window !== 'undefined') {
        const sessionId = `${res.data.sessionId}-${Date.now()}`;
        localStorage.setItem("sessionId", sessionId);
        localStorage.setItem("username", username);
        router.push("/comments");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        setError("Login failed. Please check your credentials and try again.");
      } else if (axiosError.request) {
        setError("Server is not reachable. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Login failed: ", axiosError);
    }
  };

  return (
    <Card variant="outlined">
      <Typography
        component="h1"
        variant="h4"
        color="#fff"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 1.15rem)" }}
      >
        Login Form
      </Typography>
      <Box
        component="div"
        sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="name" sx={{ color: "#ddd", mb: "2px" }}>
            Username
          </FormLabel>
          <OutlinedInput
            type="text"
            autoFocus
            color="primary"
            inputComponent={"input"}
            value={username}
            placeholder="Ex- John Smith"
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            sx={{
              color: "#fff",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.7)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#90CAF9",
              },
              ariaLabel: "username",
            }}
          />
        </FormControl>
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          fullWidth
          color="primary"
          variant="contained"
          onClick={handleLogin}
        >
          Login
        </Button>
      </Box>
    </Card>
  );
}
