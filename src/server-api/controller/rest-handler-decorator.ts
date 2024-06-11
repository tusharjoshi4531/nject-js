import applicationContext from "../../context/application-context";
import { HttpMethod } from "../../common/http-util";
import { HandlerRepository } from "../../repository/handler-repository";
import {
  createControllerIdFromConstructor,
  createFunctionId,
} from "../../common/id-util";

export function RestHandler(
  method: HttpMethod = HttpMethod.GET,
  path: string = "",
) {
  return function (
    targetPrototype: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const target = targetPrototype.constructor;

    const fnId = createFunctionId(target, propertyKey);
    const controllerId = createControllerIdFromConstructor(target);
    console.log({ descriptor });

    if (!target.__callStack) {
      target.__callStack = [];
    }
    target.__callStack.push(() => {
      applicationContext.addHandler(controllerId, method, fnId, path);
    });
  };
}

export const GET = RestHandler.bind(this, HttpMethod.GET);
export const POST = RestHandler.bind(this, HttpMethod.POST);
export const DELETE = RestHandler.bind(this, HttpMethod.DELETE);
export const PATCH = RestHandler.bind(this, HttpMethod.PATCH);
export const PUT = RestHandler.bind(this, HttpMethod.PUT);

