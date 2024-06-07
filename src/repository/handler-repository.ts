import { RouteHandlerParameter } from "../common/server-util";

export class HandlerRepository {
  private parameterMap: Map<string, Array<[number, RouteHandlerParameter]>>;

  constructor() {
    this.parameterMap = new Map();
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

  public findParametersById(id: string) {
    const parameters = this.parameterMap.get(id) ?? [];
    return parameters.sort((a, b) => a[0] - b[0]).map(([_, param]) => param);
  }
}
