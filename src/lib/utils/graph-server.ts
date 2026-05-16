const http = require("http");
const fs = require("fs");
const path = require("path");
import { findStandaloneFiles, detectCircular, buildDependencyGraph } from "./deps";
import { baseDir } from ".";
import { getIgnoreList } from ".";


export function startServer(
  graph: any,
  circular: string[][],
  standalone: string[],
  port = 3210
) {


  const distPath = path.resolve(__dirname, "../../front");
  
  
  const server = http.createServer((req: any, res: any) => {
    console.log(distPath)
    console.log("\n--- Incoming Request ---");
    console.log("URL:", req.url);

    if (req.url === "/graph") {
      console.log("Serving /graph API");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        graph,
        circular,
        standalone
      }));
      return;
    }

    if (req.url === "/reload") {
      const targetDir = path.resolve(baseDir);
      const ignoreList = getIgnoreList();
      graph = buildDependencyGraph(targetDir, ignoreList);
      circular = detectCircular(graph);
      standalone = findStandaloneFiles(graph);

      res.writeHead(200);
      res.end("reloaded");
      return;
    }

    const cleanUrl = req.url?.split("?")[0] || "/";

    let filePath = path.join(
      distPath,
      cleanUrl === "/" ? "index.html" : cleanUrl
    );


    // 2. Serve static files
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath);

      const contentType =
        ext === ".js"
          ? "application/javascript"
          : ext === ".css"
            ? "text/css"
            : ext === ".html"
              ? "text/html"
              : "application/octet-stream";

      console.log("Serving file:", filePath);
      console.log("Content-Type:", contentType);

      res.writeHead(200, { "Content-Type": contentType });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    const indexPath = path.join(distPath, "index.html");


    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { "Content-Type": "text/html" });
      fs.createReadStream(indexPath).pipe(res);
      return;
    }

    res.writeHead(404);
    res.end("Not found");
  });

  server.listen(port, () => {
    console.log("\n🚀 Running on http://localhost:" + port);
    console.log(`📊 Graph data: ${Object.keys(graph).length} nodes`);
    console.log(`🔄 Circular chains: ${circular.length}`);
    console.log(`📄 Standalone files: ${standalone.length}`);
  });

}