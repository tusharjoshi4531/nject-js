import { Constructor } from "../../common/component-util";
import { createComponentIdFromConstructor } from "../../common/id-util";
import applicationContext from "../../core/context/application-context";

export function Inject(parameterConstructor: Constructor) {
  return function (
    target: any,
    propertyKey: string | undefined,
    parameterIndex: number
  ) {
    if (propertyKey != undefined)
      throw new Error("Can only inject in constructor");

    const componentId = createComponentIdFromConstructor(target as Constructor);
    const parameterId = createComponentIdFromConstructor(parameterConstructor);

    if (!target.__callStack) {
      target.__callStack = [];
    }
    target.__callStack.push(() => {
      applicationContext.addDependancy(componentId, parameterId);
      applicationContext.addComponentConstructorParameter(
        componentId,
        parameterId,
        parameterIndex
      );
    });
  };
}
