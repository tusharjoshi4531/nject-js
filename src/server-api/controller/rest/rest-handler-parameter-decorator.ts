import { createFunctionId } from "../../../common/id-util";
import { RouteHandlerParameter } from "../../../common/server-util";
import applicationContext from "../../../core/context/application-context";

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

export const RequestObject = ControllerParameter(RouteHandlerParameter.REQUEST);
export const RequestBody = ControllerParameter(RouteHandlerParameter.REQUEST_BODY);
export const RequestQuery = ControllerParameter(RouteHandlerParameter.REQUSET_QUERY);
export const RequestParams = ControllerParameter(RouteHandlerParameter.REQUEST_PARAMS);
