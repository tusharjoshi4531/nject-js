import { HttpMethod } from "../common/http-util";
import { rootControllerKey } from "../common/id-util";

export class ControllerRepository {
  private controllerHandlerMap: Map<
    string,
    Map<[HttpMethod, string], Array<string>>
  >;
  private controllerParentMap: Map<string, string>;
  private controllerPathMap: Map<string, string>;

  constructor() {
    this.controllerHandlerMap = new Map();
    this.controllerParentMap = new Map();
    this.controllerPathMap = new Map();

    this.controllerParentMap.set(rootControllerKey(), rootControllerKey());
    this.controllerPathMap.set(rootControllerKey(), "");
    this.controllerHandlerMap.set(rootControllerKey(), new Map());
  }

  public createController(
    id: string,
    path: string,
    parent: string = rootControllerKey()
  ) {
    this.controllerPathMap.set(id, path);
    this.controllerHandlerMap.set(id, new Map());
    this.controllerParentMap.set(id, parent);
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
    const handlers = this.controllerHandlerMap.get(id);
    if (!handlers) throw new Error(`Controller does not exist with id ${id}`);
    return handlers;
  }

  public addHandlerToId(
    controllerId: string,
    method: HttpMethod,
    handlerId: string,
    path: string = ""
  ) {
    const methods = this.controllerHandlerMap.get(controllerId);
    if (!methods)
      throw new Error(`Controller does not exist with id ${controllerId}`);

    const handlers = methods.get([method, path]);
    if (handlers) {
      handlers.push(handlerId);
    } else {
      methods.set([method, path], [handlerId]);
    }
  }
}
