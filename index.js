const express = require("express");
const path = require("node:path");

const app = express();

const videosJSONFile = path.join(__dirname, "./data/videos.json");
const videos = require(videosJSONFile);

app.get("/", (_req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

app.get("/videos", (_req, res) => {
  const newVideos = videos.map(({ id, title, channel, image }) => ({
    id,
    title,
    channel,
    image,
  }));

  res.status(200).json(newVideos);
});

app.get("/videos/:videoId", (req, res) => {
  const found = videos.find((video) => video.id === req.params.videoId);
  if (found) {
    res.status(200).json(found);
  } else {
    res.status(404).json({ message: "No video with that id exists" });
  }
});

app.listen(8080, () => {
  console.log(`Server is running on port 8080 🚀`);
});
