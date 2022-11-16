require("dotenv").config();
const express = require("express");
const path = require("node:path");
const cors = require("cors");

const app = express();

const videoRouter = require("./routes/videos");

app.use(cors());
app.use(express.json());

// app.get("/", (_req, res) =>
//   res.sendFile(path.join(__dirname, "public", "index.html"))
// );
app.use(express.static(path.join(__dirname, "public")));

app.use("/videos", videoRouter);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});
