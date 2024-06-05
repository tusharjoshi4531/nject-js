import { Constructor } from "./component-util";

export function createFunctionId(
  constructor: Constructor,
  propertyKey: string
) {
  return `handler_${constructor.name}:${propertyKey}`;
}

export function rootControllerKey() {
  return `@root_controller`;
}

export function createControllerIdFromConstructor(constructor: Constructor | null) {
  if (!constructor) return rootControllerKey();
  return `controller_key_${constructor.name}`;
}

export function createComponentIdFromConstructor(constructor: Constructor | null) {
  if (!constructor) return rootControllerKey();
  return `component_key_${constructor.name}`;
}


