const express = require("express");
const path = require("path");
const app = express();

app.use(express.static("public"));
// Serve static files
app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => {
  console.log("Solarglyph Labs site running on port 3000");
// Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});



// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Solarglyph Labs site running on port ${PORT}`);
});
