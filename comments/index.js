const express = require("express");
const { randomBytes } = require("crypto");
const bodyPraser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(bodyPraser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id: commentId, content });
  commentsByPostId[req.params.id] = comments;
  await axios.post("http://localhost:4005/events", {
    type: "commentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
    },
  });

  res.status(201).send(comments);
});

app.post("/events", (req, res) => {
  console.log("recive event...", req.body.type);
  res.send({});
});

app.listen(4001, () => {
  console.log("listening on port 4001...");
});
