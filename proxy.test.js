const request = require("supertest");
const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");

jest.mock("axios");

const app = express();
const cache = new NodeCache({ stdTTL: 60 });

app.get("*", async (req, res) => {
  const url = req.originalUrl.substring(1);
  if (!url.startsWith("http")) return res.status(400).json({ error: "Invalid URL" });

  const cachedResponse = cache.get(url);
  if (cachedResponse) return res.json(cachedResponse);

  try {
    const response = await axios.get(url);
    cache.set(url, response.data);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

test("should fetch and cache response", async () => {
  axios.get.mockResolvedValue({ data: { message: "Hello, world!" } });

  const response1 = await request(app).get("/https://example.com");
  expect(response1.body).toEqual({ message: "Hello, world!" });

  const response2 = await request(app).get("/https://example.com");
  expect(response2.body).toEqual({ message: "Hello, world!" });
});
