import { RouteHandlerParameter } from "../../common/server-util";

export class HandlerRepository {
  private parameterMap: Map<string, Array<[number, RouteHandlerParameter]>>;
  private pathMap: Map<string, string>;

  constructor() {
    this.parameterMap = new Map();
    this.pathMap = new Map();
  }

  public addHandler(id: string, path: string) {
    this.pathMap.set(id, path);
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

  public findPathById(id: string) {
    const path = this.pathMap.get(id);
    if (!path) throw new Error("Handler of given id does not exist");
    return path;
  }

  public findParametersById(id: string) {
    const parameters = this.parameterMap.get(id) ?? [];
    return parameters.sort((a, b) => a[0] - b[0]).map(([_, param]) => param);
  }
}
