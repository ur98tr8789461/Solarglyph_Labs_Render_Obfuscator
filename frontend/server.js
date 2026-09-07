const express = require("express");
const app = express();

app.use(express.static("public")); // your HTML folder
app.use(express.static("public"));

app.listen(3000, () => {
  console.log("Solarglyph Labs site running on port 3000");
