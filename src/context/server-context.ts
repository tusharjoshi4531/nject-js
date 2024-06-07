import express, { RequestHandler } from "express";
import cors from "cors";
import { ServerConfig } from "../server-api/server-config";
import { HttpMethod } from "../common/http-util";

export interface IServerContext {
  boot(routeHandlers: Map<[string, string], RequestHandler[]>): void;
  getServerConfig(): ServerConfig;
  setServerConfig(config: ServerConfig): void;
}

export class ServerContext implements IServerContext {
  private app: express.Express;
  private serverConfig: ServerConfig;

  constructor() {
    this.app = express();
    this.serverConfig = new ServerConfig();
  }

  public boot(routeHandlers: Map<[string, HttpMethod], RequestHandler[]>) {
    this.app.use(express.json());

    this.app.use(
      cors({
        origin: this.getServerConfig().corsOrigins,
        methods: this.getServerConfig().corsMethods,
        allowedHeaders: this.getServerConfig().allowedHeaders,
      })
    );

    // routes
    for (const entry of routeHandlers.entries()) {
      const [[path, method], requestHandlers] = entry;
      console.log({path, method, requestHandlers});

      this.routeWithMethod(path, method, requestHandlers);
    }

    this.app.listen(this.getServerConfig().port, () => {
      console.log(`Server is running at ${this.getServerConfig().port}`);
    });
  }

  public getServerConfig() {
    return this.serverConfig;
  }

  public setServerConfig(config: ServerConfig): void {
    this.serverConfig = config;
  }

  private routeWithMethod(
    path: string,
    method: HttpMethod = HttpMethod.GET,
    handlers: RequestHandler[]
  ) {
    switch (method) {
      case HttpMethod.GET:
        return this.app.get(path, ...handlers);
      case HttpMethod.POST:
        return this.app.post(path, ...handlers);
      case HttpMethod.DELETE:
        return this.app.delete(path, ...handlers);
      case HttpMethod.PATCH:
        return this.app.patch(path, ...handlers);
      case HttpMethod.PUT:
        return this.app.put(path, ...handlers);
      case HttpMethod.OPTIONS:
        return this.app.options(path, ...handlers);
      case HttpMethod.HEAD:
        return this.app.head(path, ...handlers);
      case HttpMethod.ALL:
        return this.app.all(path, ...handlers);
      default:
        throw new Error("Method does not exist");
    }
  }
}
