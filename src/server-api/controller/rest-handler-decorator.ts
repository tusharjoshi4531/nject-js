import applicationContext from "../../context/application-context";
import { HttpMethod } from "../../common/http-util";
import { HandlerRepository } from "../../repository/handler-repository";
import {
  createControllerIdFromConstructor,
  createFunctionId,
} from "../../common/id-util";

export function RestHandler(method: HttpMethod = HttpMethod.GET) {
  return function (
    targetPrototype: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const target = targetPrototype.constructor;
    const controller = descriptor.value;

    const fnId = createFunctionId(target, propertyKey);
    const controllerId = createControllerIdFromConstructor(target);

    if (!target.__callStack) {
      target.__callStack = [];
    }
    target.__callStack.push(() => {
      applicationContext.addHandler(controllerId, method, fnId, controller);
    });
  };
}

export const GET = RestHandler(HttpMethod.GET);
export const POST = RestHandler(HttpMethod.POST);
export const DELETE = RestHandler(HttpMethod.DELETE);
