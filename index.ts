import { ExpressApplication } from "./src/server-api/application/application";
import { Application } from "./src/server-api/application/application-decorator";
import { RestController } from "./src/server-api/controller/rest/rest-controller-decorator";

import { ExpressServerConfig } from "./src/core/config/express-server-config";
import { GET } from "./src/server-api/controller/rest/rest-handler-decorator";

import { ServerResponse } from "./src/server-api/response/server-response";
import { MiddleWareResponse } from "./src/server-api/response/middleware-response";
import {
  Middleware,
  MiddlewareRoute,
} from "./src/server-api/controller/rest/rest-middleware-decorator";
import { Express } from "express";

@RestController("/test")
class TestController {
  @GET()
  public a() {
    return ServerResponse.OK("Hello");
  }

  @GET("/1")
  public c() {
    return ServerResponse.OK("Tell");
  }

  @Middleware([MiddlewareRoute.GET(""), MiddlewareRoute.GET("/1", 10)])
  public b() {
    console.log("Middleware");
    return MiddleWareResponse.NoExtend();
  }

  @Middleware([MiddlewareRoute.GET("", 10), MiddlewareRoute.GET("/1", 1)])
  public d() {
    console.log("Middleware2");
    return MiddleWareResponse.NoExtend();
  }
}

@Application
class MainApplication extends ExpressApplication {
  public override get Config() {
    return ExpressServerConfig.create().setPort(8000);
  }

  public override preConfigExpress(app: Express): void {
    console.log("wohohs")
    app.get("/pre", (req, res) => res.status(200).json("Done"));
  }
}
