import { RequestHandler } from "express";

import { Constructor, ComponentNode } from "../common/component-util";
import { ServerApplication } from "../server-api/application/application";
import { ServerConfig } from "../server-api/server-config";
import ComponentContext, { IComponentContext } from "./component-context";
import { ControllerContext, IControllerContext } from "./controller-context";
import { IServerContext, ServerContext } from "./server-context";
import { HttpMethod } from "../common/http-util";
import { RouteHandlerParameter } from "../common/server-util";

class ApplicationContext
  implements IComponentContext, IServerContext, IControllerContext
{
  private componentContext: IComponentContext;
  private serverContext: IServerContext;
  private controllerContext: IControllerContext;

  private serverApplication: ServerApplication | null;

  constructor() {
    this.componentContext = new ComponentContext();
    this.serverContext = new ServerContext();
    this.controllerContext = new ControllerContext();

    this.serverApplication = null;
  }

  public addController(
    constructor: Constructor,
    path: string,
    parentController: Constructor | null = null
  ): void {
    this.controllerContext.addController(constructor, path, parentController);
  }

  public getControllerPath(constructor: Constructor): string {
    return this.controllerContext.getControllerPath(constructor);
  }

  public addHandler(
    constructor: Constructor,
    method: HttpMethod,
    fnKey: string,
    fn: Function
  ): void {
    return this.controllerContext.addHandler(constructor, method, fnKey, fn);
  }

  public addHandlerParam(
    fnKey: string,
    param: RouteHandlerParameter,
    paramIndex: number
  ): void {
    this.controllerContext.addHandlerParam(fnKey, param, paramIndex);
  }

  public boot(): void {
    this.serverContext.boot(this.controllerContext.getRouteHandlers());
  }

  public getServerConfig(): ServerConfig {
    return this.serverContext.getServerConfig();
  }

  public setServerConfig(config: ServerConfig): void {
    this.serverContext.setServerConfig(config);
  }

  public getComponent(id: string) {
    this.componentContext.getComponent(id);
  }

  public buildContext(): void {
    this.componentContext.buildContext();
  }

  public addComponentConstructor(id: string, constructor: Constructor): void {
    this.componentContext.addComponentConstructor(id, constructor);
  }


  public addDependancy(id: string, depencancyId: string): void {
    this.componentContext.addDependancy(id, depencancyId);
  }


  public assignServerApplication(
    serverApplication: Constructor<ServerApplication>
  ) {
    if (this.serverApplication) {
      throw new Error("Server application already exists");
    }
    this.serverApplication = new serverApplication();
  }

  public getServerApplication() {
    if (!this.serverApplication) {
      throw new Error("No server application assigned");
    }
    return this.serverApplication;
  }

  public getRouteHandlers(): Map<[string, HttpMethod], RequestHandler[]> {
    return this.controllerContext.getRouteHandlers();
  }
}

const applicationContext = new ApplicationContext();

export default applicationContext;
