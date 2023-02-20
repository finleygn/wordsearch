export enum Method {
  GET="GET",
  POST="POST",
  PUT="PUT",
  DELETE="DELETE",
  PATCH="PATCH",
}

export type Handler<T> = (request: Request, services: T) => Response | Promise<Response>

class Router<T> {
  private routes: Record<Method, { url: URLPattern, callback: Handler<T> }[]> = {
    [Method.GET]: [],
    [Method.POST]: [],
    [Method.PATCH]: [],
    [Method.DELETE]: [],
    [Method.PUT]: [],
  };

  public route(type: Method, url: string, callback: Handler<T>) {
    this.routes[type].push({
      url: new URLPattern({ pathname: url }),
      callback
    });
  }

  public handle(request: Request, services: T): Response | Promise<Response> {
    try {
      for(const route of this.routes[request.method as Method]) {
        if(route.url.test(request.url)) {
          return route.callback(request,services);
        }
      }
    } catch(e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: e.status || 500,
      })
    }
    
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
    })
  }
}

export default Router;