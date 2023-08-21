import config from "./config.js"

const entryFile = config.entry;
const port = config.port;

Bun.build({
    entrypoints: ['./' + entryFile],
    outdir: "./temp",
    minify: true
})

export default {
    port,
    async fetch(request) {
      let path = JSON.parse(JSON.stringify(request.headers))["x-original-uri"];
      let file = "";
      let fileText = "";
      if (path.endsWith("/")) {
        path += "index.html"
      } 
      try {
        file = Bun.file("temp" + path);
        fileText = await file.text();
      }catch {
        return new Response("Not found path:" + path, new Headers({
            "status": 404
        }))
      }

      const MIME = await file.type;

      return new Response(fileText, new Headers({
        "status": 200,
        "Content-Type": MIME
      }));
    },
    log: console.log("app listening port:" + port)
};