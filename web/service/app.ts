import { DatabaseClient } from "../../database/main.ts";
import { validateInput } from "./util/validateInput.ts";
import Router, { Method } from './util/router.ts';
import BadRequestError from './errors/BadRequest.ts';

interface IAppServices {
  clients: Record<string, DatabaseClient>,
}

const router = new Router<IAppServices>();

router.route(
  Method.GET,
  "/",
  (request, services) => {
    const url = new URL(request.url);

    const word = url.searchParams.get("word") as string;
    const dataset = url.searchParams.get("dataset") as string;
    
    if(!word) throw new BadRequestError("No word given");
    if(!dataset) throw new BadRequestError("No dataset given");

    if(!validateInput(word)) throw new BadRequestError("Invalid word");
    if(!services.clients[dataset]) throw new BadRequestError("No dataset by this name");

    performance.mark('ms');
    const result = services.clients[dataset].search(
      word.split("").map(c => c === "*" ? null : c)
    );
    performance.mark('me');

    return new Response(JSON.stringify({
      result,
      meta: {
        took: performance.measure('_', 'ms', 'me').duration
      }
    }), { status: 200 })
  }
)

router.route(
  Method.GET,
  "/dataset",
  (_, services) => {
    const names = Object.keys(services.clients)
    return new Response(
      JSON.stringify(names),
      { status: 200 }
    );
  }
)


function createApp(services: IAppServices) {
  return async (request: Request) => {
    const response = await router.handle(request, services);

    response.headers.set("Content-Type", "application/json");
    response.headers.set("Access-Control-Allow-Origin", "*");
    
    return response;
  }
}

export default createApp;