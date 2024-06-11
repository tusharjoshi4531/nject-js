import { ServerApplication } from "./src/server-api/application/application";
import { Application } from "./src/server-api/application/application-decorator";
import { RestController } from "./src/server-api/controller/rest-controller-decorator";

import { ServerConfig } from "./src/server-api/server-config";
import { GET } from "./src/server-api/controller/rest-handler-decorator";

import { ServerResponse } from "./src/server-api/response/server-response";
import { MiddleWareResponse } from "./src/server-api/response/middleware-response";
import {
  Middleware,
  MiddlewareRoute,
} from "./src/server-api/controller/rest-middleware-decorator";

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

  @Middleware([MiddlewareRoute.GET(""), MiddlewareRoute.GET("/1")])
  public b() {
    console.log("Middleware");
    return MiddleWareResponse.NoExtend();
  }
}

@Application
class MainApplication extends ServerApplication {
  public get Config() {
    return ServerConfig.create().setPort(8000);
  }
}
