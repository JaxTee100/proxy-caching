Simple Caching Proxy Server
📌 Overview
This is a simple CLI tool that starts a caching proxy server. The proxy forwards requests to the actual server and stores the response in cache. If the same request is made again, it returns the cached response instead of forwarding the request, making things faster and reducing server load.

🚀 How It Works
Start the Proxy Server
The proxy listens for incoming HTTP requests.
Handles Requests
If the requested URL is cached, it returns the cached response.
If the requested URL is not cached, it fetches the data from the actual server, stores it in cache, and then returns it.
Clearing Cache
You can manually clear the cache using an API endpoint.
https://roadmap.sh/projects/caching-server
