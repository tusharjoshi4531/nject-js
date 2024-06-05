import { Request, Response } from "express";
import { Constructor } from "./src/common/component-util";
import { RouteHandlerParameter } from "./src/common/server-util";
import { ServerApplication } from "./src/server-api/application/application";
import { Application } from "./src/server-api/application/application-decorator";
import { RestController } from "./src/server-api/controller/rest-controller-decorator";
import { ControllerParameter } from "./src/server-api/controller/rest-handler-parameter-decorator";
import { ServerConfig } from "./src/server-api/server-config";
import { RestHandler } from "./src/server-api/controller/rest-handler-decorator";
import { HttpMethod } from "./src/common/http-util";

@RestController("/test")
class TestController {
  @RestHandler()
  GET(
    @ControllerParameter(RouteHandlerParameter.REQUEST) req: Request,
    @ControllerParameter(RouteHandlerParameter.RESPONSE) res: Response
  ) {
    console.log("Hello");
    console.log(req);
  }
}

@Application
class MainApplication extends ServerApplication {
  public get Config() {
    return ServerConfig.create().setPort(8000);
  }
}
