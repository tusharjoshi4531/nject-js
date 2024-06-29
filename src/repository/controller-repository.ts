import { HttpMethod } from "../common/http-util";
import {
  createKeyPair,
  getKeyPairValue,
  rootControllerKey,
} from "../common/id-util";

export class ControllerRepository {
  private controllerHandlerMap: Map<string, Map<string, string>>;
  private controllerMiddlewareMap: Map<
    string,
    Map<string, Array<[number, string]>>
  >;

  private controllerParentMap: Map<string, string>;
  private controllerPathMap: Map<string, string>;

  constructor() {
    this.controllerHandlerMap = new Map();
    this.controllerParentMap = new Map();
    this.controllerPathMap = new Map();
    this.controllerMiddlewareMap = new Map();

    this.controllerParentMap.set(rootControllerKey(), rootControllerKey());
    this.controllerPathMap.set(rootControllerKey(), "");
    this.controllerHandlerMap.set(rootControllerKey(), new Map());
    this.controllerMiddlewareMap.set(rootControllerKey(), new Map());
  }

  public createController(
    id: string,
    path: string,
    parent: string = rootControllerKey()
  ) {
    this.controllerPathMap.set(id, path);
    this.controllerHandlerMap.set(id, new Map());
    this.controllerParentMap.set(id, parent);
    this.controllerMiddlewareMap.set(id, new Map());
  }

  public findParentById(id: string) {
    const parentId = this.controllerParentMap.get(id);
    if (!parentId) throw new Error(`Controller does not exist with id ${id}`);
  }

  public *findAllId() {
    for (const key of this.controllerPathMap.keys()) {
      if (key === rootControllerKey()) continue;
      yield key;
    }
  }

  public findPathById(id: string) {
    const parentId = this.controllerParentMap.get(id);
    const currentPath = this.controllerPathMap.get(id);

    if (!parentId || !currentPath)
      throw new Error(`Controller does not exist with id ${id}`);

    if (parentId === rootControllerKey()) {
      return currentPath;
    }

    const prefix = this.findParentById(parentId);

    const path = prefix + currentPath;

    this.controllerPathMap.set(id, path);
    this.controllerParentMap.set(id, rootControllerKey());

    return path;
  }

  public findHandlersById(id: string) {
    const handlers = new Map<string, Array<string>>();
    const controllerMethods = this.controllerHandlerMap.get(id);
    const middleWareMethods = this.controllerMiddlewareMap.get(id);

    if (!controllerMethods || !middleWareMethods)
      throw new Error(`Controller does not exist with id ${id}`);

    for (const key of controllerMethods.keys()) {
      const contrllerHandler = controllerMethods.get(key);
      if (!contrllerHandler) throw new Error(`Controller not found`);

      const middlewarHandlers = middleWareMethods.get(key) ?? [];
      const sortedMiddlewareHandlers = middlewarHandlers
        .sort((a, b) => a[0] - b[0])
        .map(([_, x]) => x);

      handlers.set(key, [...sortedMiddlewareHandlers, contrllerHandler]);
    }

    return handlers;
  }

  public addHandlerToId(
    controllerId: string,
    method: HttpMethod,
    handlerId: string,
    path: string = ""
  ) {
    const key = createKeyPair(method, path);

    const methods = this.controllerHandlerMap.get(controllerId);
    if (!methods)
      throw new Error(`Controller does not exist with id ${controllerId}`);

    if (methods.has(key)) {
      console.warn("Overriding controller of " + [method, path]);
    }

    methods.set(key, handlerId);
  }

  public addMiddleWareToId(
    controllerId: string,
    method: HttpMethod,
    middlewareId: string,
    path: string = "",
    order: number = 0
  ) {
    const key = createKeyPair(method, path);
    const methods = this.controllerMiddlewareMap.get(controllerId);
    if (!methods)
      throw new Error(`Controller does not exist with id ${controllerId}`);

    if (!methods.has(key)) {
      methods.set(key, []);
    }

    const middlewares = methods.get(key);

    middlewares?.push([order, middlewareId]);
  }
}
