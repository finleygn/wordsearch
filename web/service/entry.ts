import { Server } from "https://deno.land/std@0.177.0/http/server.ts";
import { parse } from "https://deno.land/std@0.175.0/flags/mod.ts";
import { join } from "https://deno.land/std@0.177.0/path/mod.ts";
import defaultConfig from "./config.ts";
import createApp from "./app.ts";
import { DatabaseClient } from "../../database/main.ts";

const flags = parse(Deno.args, {
  string: ["port", "words"],
  default: {
    port: Deno.env.get("WRDSRCH_PORT") || defaultConfig.port,
    words: Deno.env.get("WRDSRCH_WORDS") || defaultConfig.words
  },
});

const databaseClient = new DatabaseClient(
  join(flags.words, "index"),
  join(flags.words, "block"),
);

try {
  await databaseClient.connect();
} catch(e) {
  console.error("Failed to setup database, local files not found.");
  throw e;
}

const server = new Server({
  port: Number(flags.port),
  handler: createApp({
    client: databaseClient
  })
});

console.log("Starting server at", `http://127.0.0.1:${flags.port}.`);

await server.listenAndServe();