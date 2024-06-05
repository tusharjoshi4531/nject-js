import { Constructor } from "../../common/component-util";
import { Component } from "../component/component-decorator";
import applicationContext from "../../context/application-context";

export function RestController(
  path: string = "",
  parentController: Constructor | null = null
) {
  return function (constructor: Constructor) {
    Component(constructor);
    console.log("controller");

    applicationContext.addController(constructor, path, parentController);
    console.log("Added");
    const callStack = (constructor as any).__callStack;
    while (callStack.length) {
      callStack[callStack.length - 1]();
      callStack.pop();
    }

    (constructor as any).__callStack = undefined;
  };
}
