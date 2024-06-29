import { ServerConfig } from "../server-config";
import { Express } from "express";

export abstract class ExpressApplication {
  public get Config(): ServerConfig {
    return new ServerConfig();
  }

  public preConfigExpress(app: Express) {}
}
