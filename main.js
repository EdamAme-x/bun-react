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
      const path = JSON.parse(JSON.stringify(request.headers))["x-original-uri"];
      let file = "";
      try {
        file = await Bun.file("temp" + path).text();
      }catch {
        return new Response("Not found path:" + path, new Headers({
            status: 404
        }))
      }
      return new Response(file);
    },
    log: console.log("app listening port:" + port)
};