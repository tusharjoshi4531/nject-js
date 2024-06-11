import { RequestHandler } from "express";
import { HttpMethod } from "../common/http-util";
import {
  RouteHandlerParameter,
  getPropertyFromRequestOrResponse,
} from "../common/server-util";
import { ControllerRepository } from "../repository/controller-repository";
import { HandlerRepository } from "../repository/handler-repository";
import {
  createComponentIdFromClassName,
  createKeyPair,
  getClassFromFunctionId,
  getFunctionKeyFromFunctionId,
  getKeyPairValue,
  rootControllerKey,
} from "../common/id-util";
import { ComponentObjectRepository } from "../repository/component-object-repository";
import { ServerResponse } from "../server-api/response/server-response";
export type RouteHandler = {
  handler: Function;
  parameters: [number, RouteHandlerParameter][];
};
import { ServerError } from "../error/ServerError";
import { MiddleWareResponse } from "../server-api/response/middleware-response";

export interface IControllerContext {
  addController(
    constructorId: string,
    path: string,
    parentControllerId?: string
  ): void;
  getControllerPath(constructorId: string): string;

  addHandler(
    constructorId: string,
    method: HttpMethod,
    fnId: string,
    path: string
  ): void;
  addMiddlewareHandler(
    constructorId: string,
    method: HttpMethod,
    fnId: string,
    path: string
  ): void;
  addHandlerParam(
    fnId: string,
    param: RouteHandlerParameter,
    paramIndex: number
  ): void;
  getRouteHandlers(): Map<string, RequestHandler[]>;
}

export class ControllerContext implements IControllerContext {
  private controllerRepository: ControllerRepository;
  private handlerRepository: HandlerRepository;
  private componentObjectRepository: ComponentObjectRepository;

  constructor(
    controllerRepository: ControllerRepository,
    handlerRepository: HandlerRepository,
    componentObjectRepository: ComponentObjectRepository
  ) {
    this.controllerRepository = controllerRepository;
    this.handlerRepository = handlerRepository;
    this.componentObjectRepository = componentObjectRepository;
  }

  public addController(
    constructorId: string,
    path: string,
    parentControllerId: string = rootControllerKey()
  ) {
    this.controllerRepository.createController(
      constructorId,
      path,
      parentControllerId
    );
  }

  public getControllerPath(constructorId: string): string {
    return this.controllerRepository.findPathById(constructorId);
  }

  public addHandler(
    constructorId: string,
    method: HttpMethod,
    fnId: string,
    path: string
  ): void {
    this.handlerRepository.addHandler(fnId, path);
    this.controllerRepository.addHandlerToId(constructorId, method, fnId, path);
    console.log({ h_repo: this.handlerRepository });
  }

  public addMiddlewareHandler(
    constructorId: string,
    method: HttpMethod,
    fnId: string,
    path: string
  ): void {
    this.handlerRepository.addHandler(fnId, path);
    this.controllerRepository.addMiddleWareToId(
      constructorId,
      method,
      fnId,
      path
    );
  }

  public addHandlerParam(
    fnId: string,
    param: RouteHandlerParameter,
    paramIndex: number
  ): void {
    this.handlerRepository.addParameters(fnId, param, paramIndex);
  }

  public getRouteHandlers() {
    const expressRouteHandlers: Map<string, RequestHandler[]> = new Map();

    for (const controllerId of this.controllerRepository.findAllId()) {
      const handlers = this.controllerRepository.findHandlersById(controllerId);
      console.log({ handlers });
      const controllerPath =
        this.controllerRepository.findPathById(controllerId);

      for (const [key, fnIds] of handlers) {
        const [method, handlerPath] = getKeyPairValue(key);

        const requestHandlers = fnIds.map((fnId) => {
          const className = getClassFromFunctionId(fnId);
          const classId = createComponentIdFromClassName(className);
          const functionName = getFunctionKeyFromFunctionId(fnId);

          const obj = this.componentObjectRepository.findById(classId);
          const fn = obj[functionName].bind(obj);

          const parameters = this.handlerRepository.findParametersById(fnId);

          const requestHandler = this.generateExpressHandlers(fn, parameters);
          return requestHandler;
        });

        const path = controllerPath + handlerPath;
        expressRouteHandlers.set(createKeyPair(method, path), requestHandlers);
      }
    }

    return expressRouteHandlers;
  }

  // TODO: Error handling, Response Parsing
  private generateExpressHandlers(
    fn: Function,
    parameters: RouteHandlerParameter[]
  ): RequestHandler {
    return (req: any, res: any, next) => {
      const assignedParameters = parameters.map((parameterType) =>
        getPropertyFromRequestOrResponse(parameterType, req, res)
      );

      const response: ServerResponse | MiddleWareResponse = fn(
        ...assignedParameters
      );

      if (response instanceof MiddleWareResponse) {
        const requestExtension = response.RequestExtention as any;

        for (const key of Object.keys(requestExtension)) {
          req[key.toString()] = requestExtension[key.toString()];
        }

        return next();
      }

      if (response.IsError) {
        next(new ServerError(response.Status, response.Body));
      }

      res.status(response.Status).json(response.Body);
    };
  }
}
