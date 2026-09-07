const express = require("express");
const path = require("path");
const app = express();
const Version = "1.0.0";

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Homepage route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Solarglyph Labs site running on port ${PORT}`);
  console.log(`Version: ${Version}`);
});
