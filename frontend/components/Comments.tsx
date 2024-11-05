"use client";

import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import axios from "@/utils/axios";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Stack,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

interface Comment {
  id: number;
  username: string;
  comment: string;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#5C8374",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: "#eee",
}));

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const storedUsername =
      typeof window !== "undefined" ? localStorage.getItem("username") : null;
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      alert("Please login to post a comment");
      router.push("/login");
      return;
    }
    const socket: Socket = io("http://localhost:5000", {
      reconnectionAttempts: 5,
      timeout: 2000,
    });

    const fetchComments = async () => {
      try {
        const res = await axios.get("/comments");
        setComments(res.data);
        setError(null);
      } catch (error) {
        setError("Error fetching comments. Ensure the server is running.");
      }
    };

    fetchComments();

    socket.on("connect", () => {
      setError(null);
    });

    socket.on("new-comment", (comment: Comment) => {
      setComments((prev) => [comment, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [router, username]);

  const handlePostComment = async () => {
    if (newComment.trim()) {
      try {
        // Emit the new comment to the server
        const { data } = await axios.post("/comments", {
          username,
          comment: newComment,
        });

        setComments((prev) => [data, ...prev]);
        setNewComment("");
      } catch (error) {
        setError("Failed to post comment. Please try again.");
      }
    }
  };

  if (!username) return null;

  return (
    <Container
      sx={[
        {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        },
        (theme) => ({
          "&::before": {
            content: '""',
            display: "block",
            position: "absolute",
            zIndex: -1,
            inset: 0,
            backgroundImage:
              "radial-gradient(at 50% 50%, hsla(120, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
            backgroundRepeat: "no-repeat",
          },
        }),
      ]}
    >
      <CssBaseline enableColorScheme />

      <Box>
        <Typography
          gutterBottom
          component="h1"
          variant="h4"
          color="#fff"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 1.15rem)" }}
        >
          Post a comment
        </Typography>
        <TextField
          label="Write a comment"
          multiline
          rows={4}
          variant="outlined"
          color="primary"
          fullWidth
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{
            color: "#fff",
            marginBottom: "12px",
            ariaLabel: "comment",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.3)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.7)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#90CAF9",
            },
            "& .MuiInputLabel-root": {
              color: "rgba(255, 255, 255, 0.7)",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#90CAF9",
            },
            "& .MuiOutlinedInput-input": {
              color: "#fff",
            },
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.3)",
            },
            "& .MuiOutlinedInput-input::placeholder": {
              color: "rgba(255, 255, 255, 0.5)",
            },
          }}
          placeholder="Write your comment here..."
        />
        {error && (
          <Typography color="error" sx={{ marginBottom: 2 }}>
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handlePostComment}
          sx={{ marginBottom: 2 }}
        >
          Submit
        </Button>
        <Stack spacing={2}>
          <Typography
            gutterBottom
            component="h1"
            variant="h4"
            color="#eee"
            sx={{ width: "100%", fontSize: "clamp(1.5rem, 10vw, 1rem)" }}
          >
            Comments
          </Typography>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Item key={comment.id}>
                <strong>{comment.username}:</strong> {comment.comment}
              </Item>
            ))
          ) : (
            <Typography color="#F6B17A">No comments available</Typography>
          )}
        </Stack>
      </Box>
    </Container>
  );
};

export default Comments;
