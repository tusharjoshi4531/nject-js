import {
  ComponentNode,
  ComponentNodeFactory,
  Constructor,
} from "../common/component-util";
import { ComponentConstructorRepository } from "../repository/component-constructor-repository";
import { ComponentObjectRepository } from "../repository/component-object-repository";

export interface IComponentContext {
  getComponent(id: string): any;
  addComponentConstructor(id: string, constructor: Constructor): void;
  addDependancy(id: string, depencancyId: string): void;
  buildContext(): void;
}

class ComponentContext implements IComponentContext {
  // -- Members
  private componentConstructorRepository: ComponentConstructorRepository;
  private componentObjectRepository: ComponentObjectRepository;

  constructor() {
    this.componentConstructorRepository = new ComponentConstructorRepository();
    this.componentObjectRepository = new ComponentObjectRepository();
  }

  public addComponentConstructor(id: string, constructor: Constructor): void {
    this.componentConstructorRepository.create(id, constructor);
  }

  public getComponent(id: string) {
    return this.componentObjectRepository.findById(id);
  }

  public addDependancy(id: string, depencancyId: string): void {
    this.componentConstructorRepository.addDependencyToId(id, depencancyId);
  }

  public buildContext() {
    for (const id of this.componentConstructorRepository.findAllIdsInOrder()) {
      const constructor =
        this.componentConstructorRepository.findConstructorById(id);
      const obj = new constructor();

      this.componentObjectRepository.create(id, obj);
    }
  }
}

export default ComponentContext;
