import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { content as items } from "@/data/content";

export default function Content() {
  return (
    <Stack
      sx={{
        flexDirection: "column",
        alignSelf: "center",
        gap: 4,
        maxWidth: 450,
      }}
    >
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        <Typography
          component="h1"
          variant="h4"
          color="#fff"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Detrator
        </Typography>
      </Box>

      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 1 }}>
          <div>
            <Typography  sx={{ fontWeight: "medium", color: "#ddd" }}>
              {item.title}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
