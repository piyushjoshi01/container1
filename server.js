const { default: axios } = require("axios");
const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.json());

const port = 3000;

app.post("/store-file", async (req, res) => {
  const { file, data } = req.body;

  try {
    if (!file) {
      return res.status(400).json({
        file: file,
        error: "Invalid JSON input.",
      });
    }

    fs.writeFile(file, data, (err) => {
      if (err) {
        console.error("Error saving file:", err);
        return res.status(500).json({
          error: "Error while storing the file into the storage.",
        });
      }

      axios
        .post("http://localhost:6000/calculate", {
          file,
          product: "wheat",
        })
        .then((response) => {
          console.log("Axios request successful:", response.data);
          res.status(201).json({ file: file, message: "Success." });
        })
        .catch((error) => {
          console.error("Axios error:", error);
          res.status(500).json({ error: "Error in external API request." });
        });
    });
  } catch (err) {
    console.error("Error in request:", err);
    res.status(400).json({ error: "Failed to process request." });
  }
});

app.get("/", (req, res) => {
  res.send("Hello from Container-1");
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
