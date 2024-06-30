import express, { RequestHandler } from "express";
import http from "http";
import cors from "cors";
import { ExpressServerConfig } from "../../config/express-server-config";
import { HttpMethod } from "../../../common/http-util";
import { getKeyPairValue } from "../../../common/id-util";

export interface IExpressServerContext {
  boot(routeHandlers: Map<string, RequestHandler[]>): http.Server;
  getServerConfig(): ExpressServerConfig;
  setServerConfig(config: ExpressServerConfig): void;
  setPreconfigCb(cb: (app: express.Express) => void): void;
}

export class ExpressServerContext implements IExpressServerContext {
  constructor(
    private app: express.Express = express(),
    private serverConfig: ExpressServerConfig = new ExpressServerConfig(),
    private preConfigCb: (app: express.Express) => void = () => {}
  ) {}

  public boot(routeHandlers: Map<string, RequestHandler[]>) {
    this.app.use(express.json());

    this.app.use(
      cors({
        origin: this.getServerConfig().corsOrigins,
        methods: this.getServerConfig().corsMethods,
        allowedHeaders: this.getServerConfig().allowedHeaders,
      })
    );

    this.preConfigCb(this.app);

    // routes
    for (const entry of routeHandlers.entries()) {
      const [key, requestHandlers] = entry;
      const [methodString, path] = getKeyPairValue(key);
      const method = methodString as HttpMethod;

      console.log({
        method,
        path,
      });

      this.routeWithMethod(path, method, requestHandlers);
    }

    const httpServer = http.createServer(this.app);
    httpServer.listen(this.getServerConfig().port, () => {
      console.log(`Server is running at ${this.getServerConfig().port}`);
    });

    return httpServer;
  }

  public getServerConfig() {
    return this.serverConfig;
  }

  public setServerConfig(config: ExpressServerConfig): void {
    this.serverConfig = config;
  }

  setPreconfigCb(cb: (app: express.Express) => void): void {
    this.preConfigCb = cb;
  }

  private routeWithMethod(
    path: string,
    method: HttpMethod = HttpMethod.GET,
    handlers: RequestHandler[]
  ) {
    switch (method) {
      case HttpMethod.GET:
        return this.app.get(path, handlers);
      case HttpMethod.POST:
        return this.app.post(path, handlers);
      case HttpMethod.DELETE:
        return this.app.delete(path, handlers);
      case HttpMethod.PATCH:
        return this.app.patch(path, handlers);
      case HttpMethod.PUT:
        return this.app.put(path, handlers);
      case HttpMethod.OPTIONS:
        return this.app.options(path, handlers);
      case HttpMethod.HEAD:
        return this.app.head(path, handlers);
      case HttpMethod.ALL:
        return this.app.all(path, handlers);
      default:
        throw new Error("Method does not exist");
    }
  }
}
