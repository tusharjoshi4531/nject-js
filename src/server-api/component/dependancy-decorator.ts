import { Constructor } from "../../common/component-util";
import { createComponentIdFromConstructor } from "../../common/id-util";
import applicationContext from "../../context/application-context";

export function Dependancy(dependancy: Constructor) {
  return function (constructor: Constructor) {
    const constructorId = createComponentIdFromConstructor(constructor);
    const dependancyId = createComponentIdFromConstructor(dependancy);
    
    applicationContext.addDependancy(constructorId, dependancyId);
  };
}
