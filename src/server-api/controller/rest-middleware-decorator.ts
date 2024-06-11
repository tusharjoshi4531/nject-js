import { HttpMethod } from "../../common/http-util";
import {
  createControllerIdFromConstructor,
  createFunctionId,
} from "../../common/id-util";
import applicationContext from "../../context/application-context";

export class MiddlewareRoute {
  constructor(private path: string, private method: HttpMethod) {}
  public get Path() {
    return this.path;
  }
  public get Method() {
    return this.method;
  }

  public static GET(path: string) {
    return new MiddlewareRoute(path, HttpMethod.GET);
  }
  public static POST(path: string) {
    return new MiddlewareRoute(path, HttpMethod.POST);
  }
  public static PUT(path: string) {
    return new MiddlewareRoute(path, HttpMethod.PUT);
  }
  public static DELETE(path: string) {
    return new MiddlewareRoute(path, HttpMethod.DELETE);
  }
  public static PATCH(path: string) {
    return new MiddlewareRoute(path, HttpMethod.PATCH);
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
          route.Path
        );
      });
    });
  };
}
