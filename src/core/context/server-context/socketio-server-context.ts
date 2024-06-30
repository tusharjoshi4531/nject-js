import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer, Server } from "http";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export interface ISocketIoServerContext {
  boot(app: HTTPServer): void;
  // getServerConfig(): ;
  // setServerConfig(config: ExpressServerConfig): void;
  setPreconfigCb(cb: (app: SocketIOServer) => void): void;
}

export class SocketIoServerContext implements ISocketIoServerContext {
  constructor(private preConfigCb: (app: SocketIOServer) => void = () => {}) {}

  boot(server: HTTPServer) {
    const io = new SocketIOServer(server);

    this.preConfigCb(io);

    
  }

  setPreconfigCb(cb: (app: SocketIOServer) => void): void {
    this.preConfigCb = cb;
  }
}
