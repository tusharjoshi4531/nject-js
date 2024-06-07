import { Request, Response } from "express";
import { Constructor } from "./src/common/component-util";
import { RouteHandlerParameter } from "./src/common/server-util";
import { ServerApplication } from "./src/server-api/application/application";
import { Application } from "./src/server-api/application/application-decorator";
import { RestController } from "./src/server-api/controller/rest-controller-decorator";
import { ControllerParameter } from "./src/server-api/controller/rest-handler-parameter-decorator";
import { ServerConfig } from "./src/server-api/server-config";
import {
  GET,
  POST,
  RestHandler,
} from "./src/server-api/controller/rest-handler-decorator";
import { HttpMethod } from "./src/common/http-util";
import { Component } from "./src/server-api/component/component-decorator";
import { Inject } from "./src/server-api/component/dependancy-injection-decorator";
import applicationContext from "./src/context/application-context";
import { createComponentIdFromConstructor } from "./src/common/id-util";

@Component
class TestService {
  public sayHello() {
    return "Hello from test";
  }
}

@RestController("/test")
class TestController {
  private testService: TestService;
  constructor(@Inject(TestService) testService: TestService) {
    this.testService = testService;
  }

  @GET
  public get() {
    console.log("Hi");
    try {
      console.log("Hello " + this.testService.sayHello());
    } catch (err) {
      console.log(err);
    }
  }

  @POST
  public post(
    @ControllerParameter(RouteHandlerParameter.REQUEST_BODY) req: any
  ) {
    console.log(req);
  }
}

@Application
class MainApplication extends ServerApplication {
  public get Config() {
    return ServerConfig.create().setPort(8000);
  }
}
