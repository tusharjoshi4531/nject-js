import { Constructor } from "./component-util";

const sep = `:`;

export function createFunctionId(
  constructor: Constructor,
  propertyKey: string
) {
  return `handler${sep}${constructor.name}${sep}${propertyKey}`;
}

export function getClassFromFunctionId(fnId: string) {
  return fnId.split(`${sep}`)[1];
}

export function getFunctionKeyFromFunctionId(fnId: string) {
  return fnId.split(`${sep}`)[2];
}

export function rootControllerKey() {
  return `@root_controller`;
}

export function createControllerIdFromConstructor(
  constructor: Constructor | null
) {
  if (!constructor) return rootControllerKey();
  return `controller_key${sep}${constructor.name}`;
}

export function createComponentIdFromConstructor(
  constructor: Constructor | null
) {
  if (!constructor) return rootControllerKey();
  return `component_key${sep}${constructor.name}`;
}

export function createComponentIdFromClassName(classname: string) {
  return `component_key${sep}${classname}`;
}

export function createKeyPair(key1: string, key2: string) {
  return `${key1}${sep}${key2}`;
}

export function getKeyPairValue(keyPair: string) {
  return keyPair.split(sep);
}
