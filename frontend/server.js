const express = require("express");
const path = require("path");
const app = express();
const Version = "1.0.0";
app.use(express.static("public"));
// Serve static files
app.use(express.static(path.join(__dirname, "public")));
 
 
app.listen(3000, () => {
  console.log("Solarglyph Labs site running on port 3000");
// Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Solarglyph Labs site running on port ${PORT}`);
  console.log(`Version: ${Version}`);
});
