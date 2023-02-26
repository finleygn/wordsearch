import { Server } from "https://deno.land/std@0.177.0/http/server.ts";
import { parse } from "https://deno.land/std@0.175.0/flags/mod.ts";

import defaultConfig from "./config.ts";
import createApp from "./app.ts";
import DataLoader from "./dataLoader.ts";

const flags = parse(Deno.args, {
  string: ["port", "words"],
  default: {
    port: Deno.env.get("WRDSRCH_PORT") || defaultConfig.port,
    words: Deno.env.get("WRDSRCH_WORDS") || defaultConfig.words
  },
});

const dataLoader = new DataLoader(flags.words);
await dataLoader.setup();
await dataLoader.connect();

const server = new Server({
  port: Number(flags.port),
  handler: createApp({
    clients: dataLoader.getClients()
  })
});

console.log("Starting server at", `http://127.0.0.1:${flags.port}.`);

await server.listenAndServe();