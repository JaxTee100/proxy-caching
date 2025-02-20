#!/usr/bin/env node
const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");
const yargs = require("yargs");

// Setup CLI arguments
const argv = yargs
  .option("port", {
    alias: "p",
    describe: "Port to run the proxy server",
    type: "number",
    default: 3000,
  })
  .option("clear-cache", {
    alias: "c",
    describe: "Clear the cache before starting the server",
    type: "boolean",
  })
  .help()
  .alias("help", "h")
  .argv;


  
const app = express();
const cache = new NodeCache({ stdTTL: 60 }); // Cache responses for 60 seconds

app.get("*", async (req, res) => {
  const url = req.originalUrl.substring(1); // Remove leading "/"
  
  if (!url.startsWith("http")) {
    return res.status(400).json({ error: "Invalid URL. Use full URLs with http/https." });
  }

  // Check cache
  const cachedResponse = cache.get(url);
  if (cachedResponse) {
    console.log(`Cache hit for: ${url}`);
    return res.json(cachedResponse);
  }

  try {
    console.log(`Fetching: ${url}`);
    const response = await axios.get(url);
    cache.set(url, response.data); // Store response in cache
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the requested URL" });
  }
});

app.get("/cache", (req, res) => {
    const keys = cache.keys(); // Get all cached keys
    const cachedData = keys.map((key) => ({
      url: key,
      data: cache.get(key),
    }));
  
    res.json({ cachedEntries: cachedData });
  });

app.get("/clear-cache", (req, res) => {
    cache.flushAll(); // Clear all cached data
    console.log("Cache cleared!");
    res.json({ message: "Cache cleared successfully" });
  });

  if (argv["clear-cache"]) {
    cache.flushAll();
    console.log("Cache cleared before starting the server.");
  }


console.log("cached", cache)

// Start the proxy server
const PORT = argv.port;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
