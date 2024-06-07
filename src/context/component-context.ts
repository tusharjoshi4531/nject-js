import { Constructor } from "../common/component-util";
import { ComponentConstructorRepository } from "../repository/component-constructor-repository";
import { ComponentObjectRepository } from "../repository/component-object-repository";

export interface IComponentContext {
  getComponent(id: string): any;
  addComponentConstructor(id: string, constructor: Constructor): void;
  getComponentConstructorParameters(id: string): Array<string>;
  addComponentConstructorParameter(
    id: string,
    parameter: string,
    parameterIndex: number
  ): void;
  addDependancy(id: string, depencancyId: string): void;
  buildContext(): void;
}

class ComponentContext implements IComponentContext {
  // -- Members
  private componentConstructorRepository: ComponentConstructorRepository;
  private componentObjectRepository: ComponentObjectRepository;

  constructor(
    componentConstructorRepository: ComponentConstructorRepository,
    componentObjectRepository: ComponentObjectRepository
  ) {
    this.componentConstructorRepository = componentConstructorRepository;
    this.componentObjectRepository = componentObjectRepository;
  }

  public getComponentConstructorParameters(id: string) {
    return this.componentConstructorRepository.findParametersById(id);
  }

  public addComponentConstructorParameter(
    id: string,
    parameter: string,
    parameterIndex: number
  ): void {
    this.componentConstructorRepository.addParameterToId(
      id,
      parameter,
      parameterIndex
    );
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
      const parameters =
        this.componentConstructorRepository.findParametersById(id);

      

      const assignedParameters = parameters.map((parameterId) =>
        this.componentObjectRepository.findById(parameterId)
      );
      

      const obj = new constructor(...assignedParameters);

      this.componentObjectRepository.create(id, obj);
    }
  }
}

export default ComponentContext;
