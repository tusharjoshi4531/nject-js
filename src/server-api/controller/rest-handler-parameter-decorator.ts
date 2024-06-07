import { createFunctionId } from "../../common/id-util";
import { RouteHandlerParameter } from "../../common/server-util";
import applicationContext from "../../context/application-context";

export function ControllerParameter(parameterType: RouteHandlerParameter) {
  return function (
    targetPrototype: any,
    propertyKey: string,
    parameterIndex: number
  ) {
    const target = targetPrototype.constructor;

    const fnId = createFunctionId(target, propertyKey);

    if (!target.__callStack) {
      target.__callStack = [];
    }

    target.__callStack.push(() => {
      applicationContext.addHandlerParam(fnId, parameterType, parameterIndex);
    });
  };
}
