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
  getClassFromFunctionId,
  getFunctionKeyFromFunctionId,
  rootControllerKey,
} from "../common/id-util";
import { ComponentObjectRepository } from "../repository/component-object-repository";
export type RouteHandler = {
  handler: Function;
  parameters: [number, RouteHandlerParameter][];
};

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
    fn: Function
  ): void;
  addHandlerParam(
    fnId: string,
    param: RouteHandlerParameter,
    paramIndex: number
  ): void;
  getRouteHandlers(): Map<[string, HttpMethod], RequestHandler[]>;
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
    fnId: string
  ): void {
    this.controllerRepository.addHandlerToId(constructorId, method, fnId);
  }

  public addHandlerParam(
    fnId: string,
    param: RouteHandlerParameter,
    paramIndex: number
  ): void {
    this.handlerRepository.addParameters(fnId, param, paramIndex);
  }

  public getRouteHandlers() {
    const expressRouteHandlers: Map<[string, HttpMethod], RequestHandler[]> =
      new Map();

    for (const controllerId of this.controllerRepository.findAllId()) {
      const handlers = this.controllerRepository.findHandlersById(controllerId);
      const path = this.controllerRepository.findPathById(controllerId);

      for (const [method, fnIds] of handlers) {
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

        expressRouteHandlers.set([path, method], requestHandlers);
      }
    }

    return expressRouteHandlers;
  }

  // TODO: Error handling, Response Parsing
  private generateExpressHandlers(
    fn: Function,
    parameters: RouteHandlerParameter[]
  ): RequestHandler {
    return (req, res, next) => {
      const assignedParameters = parameters.map((parameterType) =>
        getPropertyFromRequestOrResponse(parameterType, req, res)
      );

      try {
        fn(...assignedParameters);
      } catch (err) {
        return res.status(400).json("ERROR");
      }

      return res.status(200).json("SUCCESS");
    };
  }
}
