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
    const path = `../piyush_PV_dir/${file}`;
    fs.writeFile(path, data, (err) => {
      if (err) {
        console.error("Error saving file:", err);
        return res.status(500).json({
          file,
          error: "Error while storing the file to the storage.",
        });
      } else {
        return res.status(201).json({ file, message: "Success." });
      }
    });
  } catch (err) {
    console.error("Error in request:", err);
    res.status(400).json({ error: "Failed to process request." });
  }
});

app.post("/calculate", (req, res) => {
  const { file, product } = req.body;
  axios
    .post("http://service-container2:80/calculate", {
      file,
      product,
    })
    .then((response) => {
      console.log("Axios request successful:", response.data);
      res.status(response.status).json(response.data);
    })
    .catch((error) => {
      console.error("Axios error:", error);
      res.status(500).json({ error: "Error in external API request." });
    });
});

app.get("/", (req, res) => {
  res.send("Hello World from Container-1 Kubernetes Assignment");
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
