import { Constructor } from "./component-util";

export function createFunctionId(
  constructor: Constructor,
  propertyKey: string
) {
  return `handler:${constructor.name}:${propertyKey}`;
}

export function getClassFromFunctionId(fnId: string) {
  return fnId.split(":")[1];
}

export function getFunctionKeyFromFunctionId(fnId: string) {
  return fnId.split(":")[2];
}

export function rootControllerKey() {
  return `@root_controller`;
}

export function createControllerIdFromConstructor(
  constructor: Constructor | null
) {
  if (!constructor) return rootControllerKey();
  return `controller_key:${constructor.name}`;
}

export function createComponentIdFromConstructor(
  constructor: Constructor | null
) {
  if (!constructor) return rootControllerKey();
  return `component_key:${constructor.name}`;
}

export function createComponentIdFromClassName(classname: string) {
  return `component_key:${classname}`;
}
