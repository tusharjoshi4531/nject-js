import applicationContext from "../../context/application-context";
import { HttpMethod } from "../../common/http-util";
import { HandlerRepository } from "../../repository/handler-repository";
import { createFunctionId } from "../../common/id-util";

export function RestHandler(method: HttpMethod = HttpMethod.GET) {
  return function (
    targetPrototype: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // console.log("Handler");
    const target = targetPrototype.constructor;
    const controller = descriptor.value;

    // console.log(targetPrototype, controller);

    if (!target.__callStack) {
      target.__callStack = [];
    }
    target.__callStack.push(() => {
      applicationContext.addHandler(
        target,
        method,
        createFunctionId(target, propertyKey),
        controller
      );
    });
  };
}
