const express = require("express");
const path = require("node:path");

const app = express();

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

app.listen(8080, () => {
  console.log(`Server is running on port 8080 🚀`);
});
