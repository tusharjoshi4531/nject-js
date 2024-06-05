export class ServerConfig {
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

  public setPort(port: number | string): ServerConfig {
    this.port = port;
    return this;
  }

  public setCorsOrigins(origins: string | string[]): ServerConfig {
    this.corsOrigins = origins;
    return this;
  }

  public setCorsMethods(methods: string | string[]): ServerConfig {
    this.corsMethods = methods;
    return this;
  }

  public setAllowedHeaders(headers: string | string[]): ServerConfig {
    this.allowedHeaders = headers;
    return this;
  }

  public static create(): ServerConfig {
    return new ServerConfig();
  }
}
