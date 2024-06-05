import { Constructor } from "../common/component-util";
import { RouteHandlerParameter } from "../common/server-util";

export class HandlerRepository {
  private handlerFunctionMap: Map<string, Function>;
  private parameterMap: Map<string, Array<[number, RouteHandlerParameter]>>;

  constructor() {
    this.handlerFunctionMap = new Map();
    this.parameterMap = new Map();
  }

  public createHandler(id: string, fn: Function) {
    this.handlerFunctionMap.set(id, fn);
  }

  public addParameters(
    id: string,
    parameter: RouteHandlerParameter,
    index: number
  ) {
    const parameterList = this.parameterMap.get(id);
    if (parameterList) {
      parameterList.push([index, parameter]);
    } else {
      this.parameterMap.set(id, [[index, parameter]]);
    }
  }

  public findHandlerById(id: string) {
    const handler = this.handlerFunctionMap.get(id);
    if (!handler) throw new Error("Handler with id does not exist");
    return handler;
  }

  public findParametersById(id: string) {
    const parameters = this.parameterMap.get(id) ?? [];
    return parameters.sort((a, b) => a[0] - b[0]).map(([_, param]) => param);
  }

  
}
