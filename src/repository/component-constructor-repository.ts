import { Constructor } from "../common/component-util";

export class ComponentConstructorRepository {
  private componentConstrutorMap: Map<string, Constructor>;
  private componentDependencyMap: Map<string, Array<string>>;

  constructor() {
    this.componentConstrutorMap = new Map();
    this.componentDependencyMap = new Map();
  }

  public create(id: string, constructor: Constructor) {
    this.componentConstrutorMap.set(id, constructor);
    this.componentDependencyMap.set(id, []);
  }

  public findConstructorById(id: string) {
    const constructor = this.componentConstrutorMap.get(id);
    if (!constructor) throw new Error(`Component of id ${id} does not exist`);
    return constructor;
  }

  public findDependancyById(id: string) {
    const dependency = this.componentDependencyMap.get(id);
    if (!dependency) throw new Error(`Component of id ${id} does not exist`);
    return dependency;
  }

  public addDependencyToId(id: string, dependancyId: string) {
    const dependancies = this.componentDependencyMap.get(id);
    if (!dependancies) throw new Error(`Component of id ${id} does not exist`);

    dependancies.push(dependancyId);
  }

  public *findAllIdsInOrder() {
    const visited: Set<string> = new Set();
    const currentDependencyPath: Set<string> = new Set();

    for (const id of this.componentDependencyMap.keys()) {
      yield* this.traverse(id, visited, currentDependencyPath);
    }
  }

  private *traverse(
    id: string,
    visited: Set<string>,
    currentDependencyPath: Set<string>
  ): Generator<string, void, unknown> {
    if (currentDependencyPath.has(id)) {
      throw new Error("Cyclic dependancy found");
    }

    visited.add(id);
    currentDependencyPath.add(id);

    const dependancies = this.findDependancyById(id);
    for (const childId of dependancies) {
      if (visited.has(childId)) continue;

      yield* this.traverse(childId, visited, currentDependencyPath);
    }

    currentDependencyPath.delete(id);
    yield id;
  }

  public static createControllerIdFromConstructor(constructor: Constructor) {
    return `controller_key_${constructor.name}`;
  }
}
