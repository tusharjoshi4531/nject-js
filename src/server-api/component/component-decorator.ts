import { Constructor } from "../../common/component-util";
import { createComponentIdFromConstructor } from "../../common/id-util";
import applicationContext from "../../core/context/application-context";

export function Component(constructor: Constructor) {
  applicationContext.addComponentConstructor(
    createComponentIdFromConstructor(constructor),
    constructor
  );
}
