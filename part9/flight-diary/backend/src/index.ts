import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

import diaryRouter from "./routes/diaries";

const PORT = 3000;

app.get("/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.use("/api/diaries", diaryRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
