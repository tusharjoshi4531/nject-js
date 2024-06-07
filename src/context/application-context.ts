import { RequestHandler } from "express";

import { Constructor } from "../common/component-util";
import { ServerApplication } from "../server-api/application/application";
import { ServerConfig } from "../server-api/server-config";
import ComponentContext, { IComponentContext } from "./component-context";
import { ControllerContext, IControllerContext } from "./controller-context";
import { IServerContext, ServerContext } from "./server-context";
import { HttpMethod } from "../common/http-util";
import { RouteHandlerParameter } from "../common/server-util";
import { rootControllerKey } from "../common/id-util";
import { ComponentConstructorRepository } from "../repository/component-constructor-repository";
import { ComponentObjectRepository } from "../repository/component-object-repository";
import { ControllerRepository } from "../repository/controller-repository";
import { HandlerRepository } from "../repository/handler-repository";

class ApplicationContext
  implements IComponentContext, IServerContext, IControllerContext
{
  private componentConstructorRepository: ComponentConstructorRepository;
  private componentObjectRepository: ComponentObjectRepository;
  private controllerRepository: ControllerRepository;
  private handlerRepository: HandlerRepository;

  private componentContext: IComponentContext;
  private serverContext: IServerContext;
  private controllerContext: IControllerContext;

  private serverApplication: ServerApplication | null;

  constructor() {
    this.componentConstructorRepository = new ComponentConstructorRepository();
    this.componentObjectRepository = new ComponentObjectRepository();
    this.controllerRepository = new ControllerRepository();
    this.handlerRepository = new HandlerRepository();

    this.componentContext = new ComponentContext(
      this.componentConstructorRepository,
      this.componentObjectRepository
    );
    this.controllerContext = new ControllerContext(
      this.controllerRepository,
      this.handlerRepository,
      this.componentObjectRepository
    );
    this.serverContext = new ServerContext();

    this.serverApplication = null;
  }

  public addController(
    constructorId: string,
    path: string,
    parentControllerId: string = rootControllerKey()
  ): void {
    this.controllerContext.addController(
      constructorId,
      path,
      parentControllerId
    );
  }

  public getControllerPath(constructorId: string): string {
    return this.controllerContext.getControllerPath(constructorId);
  }

  public addHandler(
    constructorId: string,
    method: HttpMethod,
    fnId: string,
    fn: Function
  ): void {
    return this.controllerContext.addHandler(constructorId, method, fnId, fn);
  }

  public addHandlerParam(
    fnId: string,
    param: RouteHandlerParameter,
    paramIndex: number
  ): void {
    this.controllerContext.addHandlerParam(fnId, param, paramIndex);
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
    return this.componentContext.getComponent(id);
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

  public getComponentConstructorParameters(id: string): string[] {
    return this.componentContext.getComponentConstructorParameters(id);
  }

  public addComponentConstructorParameter(
    id: string,
    parameter: string,
    parameterIndex: number
  ): void {
    this.componentContext.addComponentConstructorParameter(
      id,
      parameter,
      parameterIndex
    );
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
