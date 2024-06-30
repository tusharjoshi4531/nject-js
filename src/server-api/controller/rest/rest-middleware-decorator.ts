import { HttpMethod } from "../../../common/http-util";
import {
  createControllerIdFromConstructor,
  createFunctionId,
} from "../../../common/id-util";
import applicationContext from "../../../core/context/application-context";

export class MiddlewareRoute {
  constructor(
    private path: string,
    private method: HttpMethod,
    private order: number
  ) {}
  public get Path() {
    return this.path;
  }
  public get Method() {
    return this.method;
  }
  public get Order() {
    return this.order;
  }

  public static GET(path: string, order: number = 0) {
    return new MiddlewareRoute(path, HttpMethod.GET, order);
  }
  public static POST(path: string, order: number = 0) {
    return new MiddlewareRoute(path, HttpMethod.POST, order);
  }
  public static PUT(path: string, order: number = 0) {
    return new MiddlewareRoute(path, HttpMethod.PUT, order);
  }
  public static DELETE(path: string, order: number = 0) {
    return new MiddlewareRoute(path, HttpMethod.DELETE, order);
  }
  public static PATCH(path: string, order: number = 0) {
    return new MiddlewareRoute(path, HttpMethod.PATCH, order);
  }
}

export function Middleware(routes: MiddlewareRoute[]) {
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
      routes.forEach((route) => {
        applicationContext.addMiddlewareHandler(
          controllerId,
          route.Method,
          fnId,
          route.Path,
          route.Order
        );
      });
    });
  };
}
