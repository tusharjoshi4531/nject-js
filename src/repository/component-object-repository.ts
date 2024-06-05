export class ComponentObjectRepository {
  private componentObjectMap: Map<string, any>;

  constructor() {
    this.componentObjectMap = new Map();
  }

  public create(id: string, obj: any) {
    this.componentObjectMap.set(id, obj);
  }

  public findById<T>(id: string) {
    const obj = this.componentObjectMap.get(id);
    if (!obj) throw new Error(`Component of id ${id} does not exist`);
    return obj;
  }
}
