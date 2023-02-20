import { DatabaseClient } from "../../database/main.ts";
import { validateInput } from "./util/validateInput.ts";

interface IAppServices {
  client: DatabaseClient,
}

function handler(request: Request, services: IAppServices) {
  if(request.method === "GET") {
    const url = new URL(request.url);
    const content = url.searchParams.get("w") as string;

    try {
      validateInput(content);
    } catch(e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 400 })
    }
    
    const result = services.client.search(
      content.split("").map(c => c === "*" ? null : c)
    );

    return new Response(JSON.stringify(result), {status: 200 });
  }

  return new Response(null, { status: 404 });
}

function createApp(services: IAppServices) {
  return (request: Request) => {
    const response = handler(request, services);

    response.headers.set("Content-Type", "application/json");
    response.headers.set("Access-Control-Allow-Origin", "*");
    
    return response;
  }
}

export default createApp;