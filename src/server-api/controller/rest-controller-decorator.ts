import { Constructor } from "../../common/component-util";
import { Component } from "../component/component-decorator";
import applicationContext from "../../context/application-context";
import { createControllerIdFromConstructor } from "../../common/id-util";

export function RestController(
  path: string = "",
  parentController: Constructor | null = null
) {
  return function (constructor: Constructor) {
    Component(constructor);
    

    const constructorId = createControllerIdFromConstructor(constructor);
    const parentControllerId =
      createControllerIdFromConstructor(parentController);

    applicationContext.addController(constructorId, path, parentControllerId);
    
    const callStack = (constructor as any).__callStack;
    while (callStack.length) {
      callStack[callStack.length - 1]();
      callStack.pop();
    }

    (constructor as any).__callStack = undefined;
  };
}
