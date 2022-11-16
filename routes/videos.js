const express = require("express");
const router = express.Router();

const path = require("node:path");

const videosJSONFile = path.join(__dirname, "../data/videos.json");
const videos = require(videosJSONFile);

const { getNewId, writeJSONFile } = require("../helper/helper");

router.get("/", (_req, res) => {
  const newVideos = videos.map(({ id, title, channel, image }) => ({
    id,
    title,
    channel,
    image,
  }));
  try {
    res.status(200).json(newVideos);
  } catch (error) {
    console.log("Error retrieving the videos", error);
  }
});

router.get("/:videoId", (req, res) => {
  const found = videos.find((video) => video.id === req.params.videoId);
  if (found) {
    res.status(200).json(found);
  } else {
    res.status(404).json({ message: "No video with that id exists" });
  }
});

router.post("/", (req, res) => {
  const { title, description, image } = req.body;

  if (!title || !description || !image) {
    return res.status(400).json({
      error: "Please provide title, description, and image for adding videos",
    });
  }

  const newVideo = {
    id: getNewId(),
    title,
    channel: "BrainStation",
    image: `${process.env.BACKEND}:${process.env.PORT}/images/${image}`,
    description,
    views: 0,
    likes: 0,
    duration: "1:01",
    video: "https://project-2-api.herokuapp.com/stream",
    timestamp: Date.now(),
    comments: [],
  };

  videos.push(newVideo);
  writeJSONFile(videosJSONFile, videos);

  res.status(201).json(newVideo);
});

router.post("/:videoId/comments", (req, res) => {
  const { name, comment } = req.body;

  if (!name || !comment) {
    return res.status(400).json({
      error: "Please provide name and comment for adding comment",
    });
  }

  const newComment = {
    id: getNewId(),
    name,
    comment,
    likes: 0,
    timestamp: Date.now(),
  };

  const found = videos.find((video) => video.id === req.params.videoId);
  if (found) {
    found.comments.push(newComment);
    writeJSONFile(videosJSONFile, videos);
    const resComment = {
      name,
      comment,
      id: newComment.id,
      timestamp: newComment.timestamp,
    };
    res.status(200).json(resComment);
  } else {
    res.status(404).json({ message: "No video with that id exists" });
  }
});

router.delete("/:videoId/comments/:commentId", (req, res) => {
  const found = videos.find((video) => video.id === req.params.videoId);
  const foundComment = found.comments.find(
    (comment) => comment.id === req.params.commentId
  );

  if (foundComment) {
    const commentsAfterDeletion = found.comments.filter(
      (comment) => comment.id !== req.params.commentId
    );
    found.comments = commentsAfterDeletion;

    writeJSONFile(videosJSONFile, videos);
    delete foundComment.likes;
    res.json({ ...foundComment });
  } else {
    res.status(404).json({ errorMessage: "Comment not found" });
  }
});

module.exports = router;
