export type Constructor<T = unknown> = { new (...args: any[]): T };

export interface ComponentNode {
  constructor: Constructor;
  dependancy: Constructor[];
}

export class ComponentNodeFactory {
  static createNode(
    constructor: Constructor,
    dependancy: Constructor[]
  ): ComponentNode {
    return {
      constructor,
      dependancy: dependancy,
    };
  }
}
