import { Constructor } from "../../common/component-util";
import { createFunctionId } from "../../common/id-util";
import { RouteHandlerParameter } from "../../common/server-util";
import applicationContext from "../../context/application-context";
import { HandlerRepository } from "../../repository/handler-repository";

export function ControllerParameter(parameterType: RouteHandlerParameter) {
  return function (
    targetPrototype: any,
    propertyKey: string,
    parameterIndex: number
  ) {
    const target = targetPrototype.constructor;
    console.log({ target, propertyKey, parameterIndex });

    if (!target.__callStack) {
      target.__callStack = [];
    }

    target.__callStack.push(() => {
      applicationContext.addHandlerParam(
        createFunctionId(target, propertyKey),
        parameterType,
        parameterIndex
      );
    });
  };
}
