import { Constructor } from "../../common/component-util";

import applicationContext from "../../context/application-context";
import { ServerApplication } from "./application";

export function Application(constructor: Constructor<ServerApplication>) {
  applicationContext.assignServerApplication(constructor);
  const serverApplication = applicationContext.getServerApplication();
  applicationContext.setServerConfig(serverApplication.Config);

  applicationContext.buildContext();
  applicationContext.boot();
}
