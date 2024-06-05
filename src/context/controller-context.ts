import { RequestHandler } from "express";
import { Constructor } from "../common/component-util";
import { HttpMethod } from "../common/http-util";
import {
  RouteHandlerParameter,
  getPropertyFromRequestOrResponse,
} from "../common/server-util";
import { ControllerRepository } from "../repository/controller-repository";
import { HandlerRepository } from "../repository/handler-repository";
import { createControllerIdFromConstructor } from "../common/id-util";
export type RouteHandler = {
  handler: Function;
  parameters: [number, RouteHandlerParameter][];
};

export interface IControllerContext {
  addController(
    constructor: Constructor,
    path: string,
    parentController?: Constructor | null
  ): void;
  getControllerPath(constructor: Constructor): string;

  addHandler(
    constructor: Constructor,
    method: HttpMethod,
    fnKey: string,
    fn: Function
  ): void;
  addHandlerParam(
    fnKey: string,
    param: RouteHandlerParameter,
    paramIndex: number
  ): void;
  getRouteHandlers(): Map<[string, HttpMethod], RequestHandler[]>;
}

export class ControllerContext implements IControllerContext {
  private controllerRepository: ControllerRepository;
  private handlerRepository: HandlerRepository;

  constructor() {
    this.controllerRepository = new ControllerRepository();
    this.handlerRepository = new HandlerRepository();
  }

  public addController(
    constructor: Constructor,
    path: string,
    parentController: Constructor | null = null
  ) {
    const constructorId =
      createControllerIdFromConstructor(constructor);
    const parentId =
      createControllerIdFromConstructor(parentController);

    console.log(constructorId);

    this.controllerRepository.createController(constructorId, path, parentId);
  }

  public getControllerPath(constructor: Constructor): string {
    return this.controllerRepository.findPathById(
      createControllerIdFromConstructor(constructor)
    );
  }

  public addHandler(
    constructor: Constructor,
    method: HttpMethod,
    fnKey: string,
    fn: Function
  ): void {
    this.handlerRepository.createHandler(fnKey, fn);
    console.log({ constructor, method, fn });
    this.controllerRepository.addHandlerToId(
      createControllerIdFromConstructor(constructor),
      method,
      fnKey
    );
  }

  public addHandlerParam(
    fnKey: string,
    param: RouteHandlerParameter,
    paramIndex: number
  ): void {
    this.handlerRepository.addParameters(fnKey, param, paramIndex);
  }

  public getRouteHandlers() {
    const expressRouteHandlers: Map<[string, HttpMethod], RequestHandler[]> =
      new Map();

    for (const controllerId of this.controllerRepository.findAllId()) {
      const handlers = this.controllerRepository.findHandlersById(controllerId);
      const path = this.controllerRepository.findPathById(controllerId);

      for (const [method, fnKeys] of handlers) {
        const requestHandlers = fnKeys.map((fnKey) => {
          const fn = this.handlerRepository.findHandlerById(fnKey);
          const parameters = this.handlerRepository.findParametersById(fnKey);

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
