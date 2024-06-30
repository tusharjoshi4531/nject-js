export class ExpressServerConfig  {
  port: number | string;
  corsOrigins: string | string[];
  corsMethods: string | string[];
  allowedHeaders: string | string[];

  constructor() {
    this.port = 8080;
    this.corsOrigins = "*";
    this.corsMethods = "*";
    this.allowedHeaders = "*";
  }

  public setPort(port: number | string): ExpressServerConfig {
    this.port = port;
    return this;
  }

  public setCorsOrigins(origins: string | string[]): ExpressServerConfig {
    this.corsOrigins = origins;
    return this;
  }

  public setCorsMethods(methods: string | string[]): ExpressServerConfig {
    this.corsMethods = methods;
    return this;
  }

  public setAllowedHeaders(headers: string | string[]): ExpressServerConfig {
    this.allowedHeaders = headers;
    return this;
  }

  public static create(): ExpressServerConfig {
    return new ExpressServerConfig();
  }
}
