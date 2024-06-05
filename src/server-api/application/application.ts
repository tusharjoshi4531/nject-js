import { ServerConfig } from "../server-config";

export abstract class ServerApplication {
  public get Config(): ServerConfig {
    return new ServerConfig();
  }
}
