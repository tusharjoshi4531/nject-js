import { ExpressServerConfig } from "../../core/config/express-server-config";
import { Express } from "express";

export abstract class ExpressApplication {
  public get Config(): ExpressServerConfig {
    return new ExpressServerConfig();
  }

  public preConfigExpress(app: Express) {}
}
