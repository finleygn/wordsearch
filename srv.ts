import { Server } from "https://deno.land/std@0.177.0/http/server.ts";
import {validateInput} from './lib/validate.ts';
import search from './db/search.ts';

const handler = (request: Request) => {
  if(request.method === "GET") {
    const url = new URL(request.url);
    const content = url.searchParams.get("w") as string;
    console.log(content)

    try {
      validateInput(content);
    } catch(e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 400 })
    }
    
    const result = search({
      length: content.length,
      constraint: content.split("").map(c => c === "*" ? null : c)
    });

    return new Response(JSON.stringify(result), { status: 200 });
  }

  return new Response(null, { status: 404 });
};

console.log("Starting server at http://localhost:8000")
new Server({ port: 8000, handler })
  .listenAndServe();