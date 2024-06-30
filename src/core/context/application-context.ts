import { Constructor } from "../../common/component-util";
import { ExpressApplication } from "../../server-api/application/application";
import { ExpressServerConfig } from "../config/express-server-config";
import ComponentContext, { IComponentContext } from "./component-context";
import { ControllerContext, IControllerContext } from "./controller-context";
import {
  ExpressServerContext,
  IExpressServerContext,
} from "./server-context/express-server-context";
import { HttpMethod } from "../../common/http-util";
import { RouteHandlerParameter } from "../../common/server-util";
import { rootControllerKey } from "../../common/id-util";
import { ComponentConstructorRepository } from "../repository/component-constructor-repository";
import { ComponentObjectRepository } from "../repository/component-object-repository";
import { ControllerRepository } from "../repository/controller-repository";
import { HandlerRepository } from "../repository/handler-repository";
import { Express } from "express";

class ApplicationContext implements IComponentContext, IControllerContext {
  private componentConstructorRepository: ComponentConstructorRepository;
  private componentObjectRepository: ComponentObjectRepository;
  private controllerRepository: ControllerRepository;
  private handlerRepository: HandlerRepository;

  private componentContext: IComponentContext;
  private expressContext: IExpressServerContext;
  private controllerContext: IControllerContext;

  private expressServerApplication: ExpressApplication | null;

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
    this.expressContext = new ExpressServerContext();

    this.expressServerApplication = null;
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
    path: string
  ): void {
    this.controllerContext.addHandler(constructorId, method, fnId, path);
  }

  public addMiddlewareHandler(
    constructorId: string,
    method: HttpMethod,
    fnId: string,
    path: string,
    order: number = 0
  ): void {
    this.controllerContext.addMiddlewareHandler(
      constructorId,
      method,
      fnId,
      path,
      order
    );
  }

  public addHandlerParam(
    fnId: string,
    param: RouteHandlerParameter,
    paramIndex: number
  ): void {
    this.controllerContext.addHandlerParam(fnId, param, paramIndex);
  }

  public boot() {
    if (this.expressServerApplication) {
      this.expressContext.setServerConfig(this.expressServerApplication.Config);
      this.expressContext.setPreconfigCb((e) =>
        this.expressServerApplication?.preConfigExpress(e)
      );
    }

    const httpSErver = this.expressContext.boot(this.getRouteHandlers());
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

  public assignExpressServerApplication(
    expressServerApplication: Constructor<ExpressApplication>
  ) {
    if (this.expressServerApplication) {
      throw new Error("Server application already exists");
    }
    this.expressServerApplication = new expressServerApplication();
  }

  public getServerApplication() {
    if (!this.expressServerApplication) {
      throw new Error("No server application assigned");
    }
    return this.expressServerApplication;
  }

  public getRouteHandlers() {
    return this.controllerContext.getRouteHandlers();
  }
}

const applicationContext = new ApplicationContext();

export default applicationContext;
